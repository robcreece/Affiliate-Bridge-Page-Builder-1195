class AnalyticsService {
  constructor() {
    this.events = [];
    this.metrics = new Map();
    this.realTimeData = new Map();
    this.heatmapData = new Map();
    this.conversionFunnels = new Map();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEngagement('visibility_change', {
        hidden: document.hidden,
        timestamp: Date.now()
      });
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.trackEngagement('scroll_depth', {
          depth: scrollPercent,
          timestamp: Date.now()
        });
      }
    });

    // Track clicks for heatmap
    document.addEventListener('click', (e) => {
      this.trackHeatmapClick(e);
    });

    // Track form interactions
    document.addEventListener('focus', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        this.trackEngagement('form_focus', {
          field: e.target.name || e.target.id,
          timestamp: Date.now()
        });
      }
    }, true);
  }

  // Core tracking methods
  trackPageView(pageId, userId = null, metadata = {}) {
    const event = {
      id: this.generateEventId(),
      type: 'page_view',
      pageId,
      userId,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        url: window.location.href,
        title: document.title
      }
    };

    this.events.push(event);
    this.updateRealTimeMetrics(pageId, 'page_views');
    this.sendToAnalytics(event);
    
    return event.id;
  }

  trackConversion(pageId, userId = null, conversionType, value = 0, metadata = {}) {
    const event = {
      id: this.generateEventId(),
      type: 'conversion',
      pageId,
      userId,
      conversionType,
      value,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      metadata
    };

    this.events.push(event);
    this.updateRealTimeMetrics(pageId, 'conversions');
    this.updateConversionFunnel(pageId, conversionType);
    this.sendToAnalytics(event);
    
    return event.id;
  }

  trackEngagement(eventType, data) {
    const event = {
      id: this.generateEventId(),
      type: 'engagement',
      eventType,
      data,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      pageId: this.getCurrentPageId()
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  trackHeatmapClick(clickEvent) {
    const pageId = this.getCurrentPageId();
    if (!pageId) return;

    const clickData = {
      x: clickEvent.clientX,
      y: clickEvent.clientY,
      element: clickEvent.target.tagName,
      className: clickEvent.target.className,
      id: clickEvent.target.id,
      timestamp: Date.now()
    };

    if (!this.heatmapData.has(pageId)) {
      this.heatmapData.set(pageId, []);
    }
    
    this.heatmapData.get(pageId).push(clickData);
    
    this.trackEngagement('click', clickData);
  }

  // Analytics computation methods
  getPageAnalytics(pageId, timeRange = '7d') {
    const events = this.getEventsForPage(pageId, timeRange);
    
    const pageViews = events.filter(e => e.type === 'page_view').length;
    const conversions = events.filter(e => e.type === 'conversion').length;
    const conversionRate = pageViews > 0 ? (conversions / pageViews) * 100 : 0;

    const uniqueVisitors = new Set(
      events.filter(e => e.userId).map(e => e.userId)
    ).size;

    const avgTimeOnPage = this.calculateAverageTimeOnPage(events);
    const bounceRate = this.calculateBounceRate(events);
    const topTrafficSources = this.getTopTrafficSources(events);

    return {
      pageId,
      timeRange,
      metrics: {
        pageViews,
        uniqueVisitors,
        conversions,
        conversionRate: Math.round(conversionRate * 100) / 100,
        avgTimeOnPage,
        bounceRate,
        topTrafficSources
      },
      chartData: this.generateChartData(events, timeRange)
    };
  }

  getEventsForPage(pageId, timeRange) {
    const now = Date.now();
    const timeRangeMs = this.parseTimeRange(timeRange);
    const startTime = now - timeRangeMs;

    return this.events.filter(event => 
      event.pageId === pageId && 
      event.timestamp >= startTime
    );
  }

  calculateAverageTimeOnPage(events) {
    const sessions = new Map();
    
    events.forEach(event => {
      const sessionId = event.sessionId;
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
          start: event.timestamp,
          end: event.timestamp,
          events: []
        });
      }
      
      const session = sessions.get(sessionId);
      session.end = Math.max(session.end, event.timestamp);
      session.events.push(event);
    });

    const sessionDurations = Array.from(sessions.values())
      .map(session => session.end - session.start)
      .filter(duration => duration > 0);

    if (sessionDurations.length === 0) return 0;

    const avgDuration = sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length;
    return Math.round(avgDuration / 1000); // Convert to seconds
  }

  calculateBounceRate(events) {
    const sessions = new Map();
    
    events.forEach(event => {
      const sessionId = event.sessionId;
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, []);
      }
      sessions.get(sessionId).push(event);
    });

    const totalSessions = sessions.size;
    const bouncedSessions = Array.from(sessions.values())
      .filter(sessionEvents => sessionEvents.length === 1).length;

    return totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;
  }

  getTopTrafficSources(events) {
    const sources = new Map();
    
    events.filter(e => e.type === 'page_view').forEach(event => {
      const referrer = event.metadata.referrer || 'Direct';
      const source = this.categorizeTrafficSource(referrer);
      sources.set(source, (sources.get(source) || 0) + 1);
    });

    return Array.from(sources.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }));
  }

  categorizeTrafficSource(referrer) {
    if (!referrer || referrer === '') return 'Direct';
    
    const domain = new URL(referrer).hostname.toLowerCase();
    
    if (domain.includes('google')) return 'Google';
    if (domain.includes('facebook')) return 'Facebook';
    if (domain.includes('twitter')) return 'Twitter';
    if (domain.includes('linkedin')) return 'LinkedIn';
    if (domain.includes('youtube')) return 'YouTube';
    if (domain.includes('instagram')) return 'Instagram';
    
    return 'Other';
  }

  generateChartData(events, timeRange) {
    const now = Date.now();
    const timeRangeMs = this.parseTimeRange(timeRange);
    const intervals = this.getTimeIntervals(timeRange);
    
    const pageViewsData = [];
    const conversionsData = [];
    
    intervals.forEach(interval => {
      const intervalEvents = events.filter(e => 
        e.timestamp >= interval.start && e.timestamp < interval.end
      );
      
      const pageViews = intervalEvents.filter(e => e.type === 'page_view').length;
      const conversions = intervalEvents.filter(e => e.type === 'conversion').length;
      
      pageViewsData.push({
        date: new Date(interval.start).toISOString(),
        value: pageViews
      });
      
      conversionsData.push({
        date: new Date(interval.start).toISOString(),
        value: conversions
      });
    });

    return {
      pageViews: pageViewsData,
      conversions: conversionsData
    };
  }

  getTimeIntervals(timeRange) {
    const now = Date.now();
    const timeRangeMs = this.parseTimeRange(timeRange);
    const startTime = now - timeRangeMs;
    
    const intervals = [];
    let intervalSize;
    let intervalCount;
    
    switch (timeRange) {
      case '24h':
        intervalSize = 60 * 60 * 1000; // 1 hour
        intervalCount = 24;
        break;
      case '7d':
        intervalSize = 24 * 60 * 60 * 1000; // 1 day
        intervalCount = 7;
        break;
      case '30d':
        intervalSize = 24 * 60 * 60 * 1000; // 1 day
        intervalCount = 30;
        break;
      default:
        intervalSize = 24 * 60 * 60 * 1000; // 1 day
        intervalCount = 7;
    }
    
    for (let i = 0; i < intervalCount; i++) {
      const start = startTime + (i * intervalSize);
      const end = start + intervalSize;
      intervals.push({ start, end });
    }
    
    return intervals;
  }

  // Conversion funnel analysis
  updateConversionFunnel(pageId, conversionType) {
    if (!this.conversionFunnels.has(pageId)) {
      this.conversionFunnels.set(pageId, new Map());
    }
    
    const funnel = this.conversionFunnels.get(pageId);
    funnel.set(conversionType, (funnel.get(conversionType) || 0) + 1);
  }

  getConversionFunnel(pageId) {
    const funnel = this.conversionFunnels.get(pageId) || new Map();
    const totalViews = this.getEventsForPage(pageId, '30d')
      .filter(e => e.type === 'page_view').length;
    
    const steps = [
      { name: 'Page Views', count: totalViews },
      { name: 'Video Views', count: funnel.get('video_play') || 0 },
      { name: 'CTA Clicks', count: funnel.get('cta_click') || 0 },
      { name: 'Conversions', count: funnel.get('purchase') || 0 }
    ];
    
    return steps.map((step, index) => ({
      ...step,
      percentage: totalViews > 0 ? (step.count / totalViews) * 100 : 0,
      dropoff: index > 0 ? steps[index - 1].count - step.count : 0
    }));
  }

  // Real-time metrics
  updateRealTimeMetrics(pageId, metricType) {
    const now = Date.now();
    const key = `${pageId}_${metricType}`;
    
    if (!this.realTimeData.has(key)) {
      this.realTimeData.set(key, []);
    }
    
    const data = this.realTimeData.get(key);
    data.push({ timestamp: now, value: 1 });
    
    // Keep only last 5 minutes of data
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    this.realTimeData.set(key, data.filter(d => d.timestamp >= fiveMinutesAgo));
  }

  getRealTimeMetrics(pageId) {
    const now = Date.now();
    const oneMinuteAgo = now - (60 * 1000);
    
    const pageViews = this.realTimeData.get(`${pageId}_page_views`) || [];
    const conversions = this.realTimeData.get(`${pageId}_conversions`) || [];
    
    return {
      activeUsers: this.getActiveUsers(pageId),
      pageViewsLastMinute: pageViews.filter(d => d.timestamp >= oneMinuteAgo).length,
      conversionsLastMinute: conversions.filter(d => d.timestamp >= oneMinuteAgo).length,
      currentVisitors: this.getCurrentVisitors(pageId)
    };
  }

  getActiveUsers(pageId) {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    const recentEvents = this.events.filter(e => 
      e.pageId === pageId && 
      e.timestamp >= fiveMinutesAgo
    );
    
    return new Set(recentEvents.map(e => e.sessionId)).size;
  }

  getCurrentVisitors(pageId) {
    const oneMinuteAgo = Date.now() - (60 * 1000);
    const recentEvents = this.events.filter(e => 
      e.pageId === pageId && 
      e.timestamp >= oneMinuteAgo
    );
    
    return new Set(recentEvents.map(e => e.sessionId)).size;
  }

  // Heatmap data
  getHeatmapData(pageId) {
    return this.heatmapData.get(pageId) || [];
  }

  // A/B Testing support
  trackABTest(pageId, testId, variant, eventType) {
    const event = {
      id: this.generateEventId(),
      type: 'ab_test',
      pageId,
      testId,
      variant,
      eventType,
      timestamp: Date.now(),
      sessionId: this.getSessionId()
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  getABTestResults(testId) {
    const testEvents = this.events.filter(e => 
      e.type === 'ab_test' && e.testId === testId
    );
    
    const variants = new Map();
    
    testEvents.forEach(event => {
      if (!variants.has(event.variant)) {
        variants.set(event.variant, {
          impressions: 0,
          conversions: 0,
          conversionRate: 0
        });
      }
      
      const variant = variants.get(event.variant);
      
      if (event.eventType === 'impression') {
        variant.impressions++;
      } else if (event.eventType === 'conversion') {
        variant.conversions++;
      }
      
      variant.conversionRate = variant.impressions > 0 
        ? (variant.conversions / variant.impressions) * 100 
        : 0;
    });
    
    return Array.from(variants.entries()).map(([name, data]) => ({
      variant: name,
      ...data
    }));
  }

  // Utility methods
  parseTimeRange(timeRange) {
    const ranges = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    };
    
    return ranges[timeRange] || ranges['7d'];
  }

  generateEventId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  getCurrentPageId() {
    return window.bridgePageId || null;
  }

  async sendToAnalytics(event) {
    try {
      // In production, send to your analytics endpoint
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
      // Store failed events for retry
      this.storeFailedEvent(event);
    }
  }

  storeFailedEvent(event) {
    const failedEvents = JSON.parse(localStorage.getItem('failed_analytics_events') || '[]');
    failedEvents.push(event);
    localStorage.setItem('failed_analytics_events', JSON.stringify(failedEvents));
  }

  // Export data for external analysis
  exportData(pageId, timeRange = '30d', format = 'json') {
    const events = this.getEventsForPage(pageId, timeRange);
    const analytics = this.getPageAnalytics(pageId, timeRange);
    
    const exportData = {
      pageId,
      timeRange,
      exportedAt: new Date().toISOString(),
      analytics,
      events,
      heatmapData: this.getHeatmapData(pageId)
    };
    
    if (format === 'csv') {
      return this.convertToCSV(exportData);
    }
    
    return exportData;
  }

  convertToCSV(data) {
    const events = data.events;
    const headers = ['timestamp', 'type', 'eventType', 'userId', 'sessionId', 'metadata'];
    
    const csvContent = [
      headers.join(','),
      ...events.map(event => [
        new Date(event.timestamp).toISOString(),
        event.type,
        event.eventType || '',
        event.userId || '',
        event.sessionId || '',
        JSON.stringify(event.metadata || {})
      ].join(','))
    ].join('\n');
    
    return csvContent;
  }
}

export default new AnalyticsService();