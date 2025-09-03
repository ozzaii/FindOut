import type { AffiliateClick } from '../types';

interface AffiliatePartner {
  id: string;
  name: string;
  domain: string;
  commission_rate: number;
  cookie_duration: number; // days
  tracking_method: 'url_param' | 'pixel' | 'postback';
  base_affiliate_url: string;
  affiliate_id: string;
}

// Turkish fashion brand affiliate partners
const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  {
    id: 'trendyol',
    name: 'Trendyol',
    domain: 'trendyol.com',
    commission_rate: 8.5,
    cookie_duration: 30,
    tracking_method: 'url_param',
    base_affiliate_url: 'https://ty.gl/findout',
    affiliate_id: 'findout_partner'
  },
  {
    id: 'hm_turkey',
    name: 'H&M Turkey',
    domain: 'hm.com',
    commission_rate: 7.0,
    cookie_duration: 7,
    tracking_method: 'url_param',
    base_affiliate_url: 'https://www2.hm.com/tr_tr',
    affiliate_id: 'findout_hm'
  },
  {
    id: 'zara_turkey',
    name: 'Zara Turkey',
    domain: 'zara.com',
    commission_rate: 6.5,
    cookie_duration: 14,
    tracking_method: 'url_param',
    base_affiliate_url: 'https://zara.com/tr',
    affiliate_id: 'findout_zara'
  },
  {
    id: 'lcwaikiki',
    name: 'LC Waikiki',
    domain: 'lcwaikiki.com',
    commission_rate: 9.0,
    cookie_duration: 21,
    tracking_method: 'url_param',
    base_affiliate_url: 'https://www.lcwaikiki.com/tr-TR',
    affiliate_id: 'findout_lcw'
  },
  {
    id: 'mango_turkey',
    name: 'Mango Turkey',
    domain: 'shop.mango.com',
    commission_rate: 7.5,
    cookie_duration: 10,
    tracking_method: 'url_param',
    base_affiliate_url: 'https://shop.mango.com/tr',
    affiliate_id: 'findout_mango'
  },
  {
    id: 'koton',
    name: 'Koton',
    domain: 'koton.com',
    commission_rate: 10.0,
    cookie_duration: 14,
    tracking_method: 'url_param',
    base_affiliate_url: 'https://www.koton.com',
    affiliate_id: 'findout_koton'
  },
  {
    id: 'defacto',
    name: 'DeFacto',
    domain: 'defacto.com.tr',
    commission_rate: 8.0,
    cookie_duration: 30,
    tracking_method: 'url_param',
    base_affiliate_url: 'https://www.defacto.com.tr',
    affiliate_id: 'findout_defacto'
  }
];

class AffiliateTrackingService {
  private trackingPixel: HTMLImageElement | null = null;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  /**
   * Initialize user tracking
   */
  setUserId(userId: string) {
    this.userId = userId;
    this.storeUserSession(userId);
  }

  /**
   * Generate affiliate tracking URL
   */
  generateAffiliateUrl(
    originalUrl: string,
    productId: string,
    outfitId: string,
    userId?: string
  ): string {
    try {
      const url = new URL(originalUrl);
      const domain = url.hostname.replace('www.', '');
      
      // Find matching affiliate partner
      const partner = AFFILIATE_PARTNERS.find(p => 
        domain.includes(p.domain.replace('www.', '')) || 
        p.domain.includes(domain)
      );

      if (!partner) {
        // Return original URL with basic tracking
        return this.addTrackingParams(originalUrl, productId, outfitId, userId);
      }

      // Generate affiliate URL based on partner configuration
      const affiliateUrl = this.buildAffiliateUrl(partner, originalUrl, productId, outfitId, userId);
      
      // Store click tracking data
      this.prepareClickTracking(productId, outfitId, partner, userId);
      
      return affiliateUrl;
    } catch (error) {
      console.error('Error generating affiliate URL:', error);
      return this.addTrackingParams(originalUrl, productId, outfitId, userId);
    }
  }

  /**
   * Track affiliate link click
   */
  async trackClick(
    productId: string,
    outfitId: string,
    originalUrl: string,
    userId?: string
  ): Promise<AffiliateClick> {
    const clickData: Omit<AffiliateClick, 'id' | 'created_at'> = {
      user_id: userId || this.userId || undefined,
      product_id: productId,
      ip_address: await this.getClientIP(),
      user_agent: navigator.userAgent,
      referrer: document.referrer || window.location.href,
      converted: false,
      revenue: 0,
      commission_rate: this.getCommissionRate(originalUrl)
    };

    // Store click data
    const clickId = await this.storeClickData(clickData);
    
    // Fire tracking pixel
    this.fireTrackingPixel(productId, outfitId, clickId);
    
    // Update real-time analytics
    this.updateClickAnalytics(productId, outfitId);

    return {
      id: clickId,
      ...clickData,
      created_at: new Date().toISOString()
    };
  }

  /**
   * Track conversion (when user completes purchase)
   */
  async trackConversion(
    clickId: string,
    orderId: string,
    orderValue: number,
    commission: number
  ): Promise<void> {
    try {
      // Update click record with conversion data
      await this.updateClickConversion(clickId, orderId, orderValue, commission);
      
      // Update user earnings
      if (this.userId) {
        await this.updateUserEarnings(this.userId, commission);
      }
      
      // Fire conversion pixel
      this.fireConversionPixel(clickId, orderId, orderValue, commission);
      
      // Update analytics
      this.updateConversionAnalytics(clickId, orderValue, commission);
      
    } catch (error) {
      console.error('Conversion tracking failed:', error);
    }
  }

  /**
   * Get real-time click analytics
   */
  async getClickAnalytics(productId?: string, outfitId?: string, timeframe: '1d' | '7d' | '30d' = '7d') {
    const analytics = await this.fetchClickAnalytics(productId, outfitId, timeframe);
    return {
      total_clicks: analytics.total_clicks || 0,
      unique_clicks: analytics.unique_clicks || 0,
      conversion_rate: analytics.conversions > 0 ? (analytics.conversions / analytics.total_clicks) * 100 : 0,
      total_revenue: analytics.total_revenue || 0,
      total_commission: analytics.total_commission || 0,
      average_order_value: analytics.conversions > 0 ? analytics.total_revenue / analytics.conversions : 0,
      top_converting_products: analytics.top_products || [],
      click_sources: analytics.click_sources || [],
      hourly_distribution: analytics.hourly_clicks || []
    };
  }

  /**
   * Get user earnings dashboard
   */
  async getUserEarnings(userId: string, period: 'daily' | 'weekly' | 'monthly' | 'all' = 'monthly') {
    const earnings = await this.fetchUserEarnings(userId, period);
    return {
      total_earnings: earnings.total_earnings || 0,
      pending_earnings: earnings.pending_earnings || 0,
      paid_earnings: earnings.paid_earnings || 0,
      total_clicks: earnings.total_clicks || 0,
      conversions: earnings.conversions || 0,
      conversion_rate: earnings.conversion_rate || 0,
      top_performing_outfits: earnings.top_outfits || [],
      earnings_by_brand: earnings.brand_breakdown || [],
      recent_transactions: earnings.recent_transactions || [],
      payout_history: earnings.payout_history || []
    };
  }

  /**
   * Detect brand from URL
   */
  detectBrand(url: string): AffiliatePartner | null {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return AFFILIATE_PARTNERS.find(partner => 
        domain.includes(partner.domain.replace('www.', '')) ||
        partner.domain.includes(domain)
      ) || null;
    } catch {
      return null;
    }
  }

  /**
   * Get commission rate for URL
   */
  getCommissionRate(url: string): number {
    const partner = this.detectBrand(url);
    return partner?.commission_rate || 5.0; // Default 5% commission
  }

  /**
   * Shorten URL for better UX
   */
  async shortenUrl(longUrl: string): Promise<string> {
    // In production, integrate with URL shortening service (bit.ly, etc.)
    // For now, return the long URL
    return longUrl;
  }

  // Private helper methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking(): void {
    // Set up tracking pixel container
    this.trackingPixel = document.createElement('img');
    this.trackingPixel.style.display = 'none';
    this.trackingPixel.width = 1;
    this.trackingPixel.height = 1;
    document.body.appendChild(this.trackingPixel);

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flushPendingEvents();
      }
    });

    // Flush events before page unload
    window.addEventListener('beforeunload', () => {
      this.flushPendingEvents();
    });
  }

  private buildAffiliateUrl(
    partner: AffiliatePartner,
    originalUrl: string,
    productId: string,
    outfitId: string,
    userId?: string
  ): string {
    const url = new URL(originalUrl);
    
    // Add affiliate tracking parameters
    url.searchParams.set('affiliate_id', partner.affiliate_id);
    url.searchParams.set('source', 'findout');
    url.searchParams.set('product_id', productId);
    url.searchParams.set('outfit_id', outfitId);
    
    if (userId) {
      url.searchParams.set('user_id', userId);
    }
    
    url.searchParams.set('session_id', this.sessionId);
    url.searchParams.set('timestamp', Date.now().toString());
    
    // Add UTM parameters for better tracking
    url.searchParams.set('utm_source', 'findout');
    url.searchParams.set('utm_medium', 'affiliate');
    url.searchParams.set('utm_campaign', 'outfit_discovery');
    url.searchParams.set('utm_content', outfitId);
    
    return url.toString();
  }

  private addTrackingParams(originalUrl: string, productId: string, outfitId: string, userId?: string): string {
    try {
      const url = new URL(originalUrl);
      url.searchParams.set('ref', 'findout');
      url.searchParams.set('product_id', productId);
      url.searchParams.set('outfit_id', outfitId);
      if (userId) url.searchParams.set('user_id', userId);
      return url.toString();
    } catch {
      return originalUrl;
    }
  }

  private prepareClickTracking(productId: string, outfitId: string, partner: AffiliatePartner, userId?: string): void {
    // Store tracking data in session storage for immediate access
    const trackingData = {
      product_id: productId,
      outfit_id: outfitId,
      partner_id: partner.id,
      user_id: userId,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem(`tracking_${productId}`, JSON.stringify(trackingData));
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  private async storeClickData(clickData: Omit<AffiliateClick, 'id' | 'created_at'>): Promise<string> {
    // In production, store in database
    const clickId = `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store in localStorage for now (would be database in production)
    const storedClicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    storedClicks.push({
      id: clickId,
      ...clickData,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('affiliate_clicks', JSON.stringify(storedClicks));
    
    return clickId;
  }

  private fireTrackingPixel(productId: string, outfitId: string, clickId: string): void {
    if (this.trackingPixel) {
      const trackingUrl = `https://analytics.findout.com/track?` +
        `event=click&product=${productId}&outfit=${outfitId}&click=${clickId}&t=${Date.now()}`;
      
      this.trackingPixel.src = trackingUrl;
    }
  }

  private fireConversionPixel(clickId: string, orderId: string, orderValue: number, commission: number): void {
    if (this.trackingPixel) {
      const conversionUrl = `https://analytics.findout.com/track?` +
        `event=conversion&click=${clickId}&order=${orderId}&value=${orderValue}&commission=${commission}&t=${Date.now()}`;
      
      this.trackingPixel.src = conversionUrl;
    }
  }

  private updateClickAnalytics(productId: string, _outfitId: string): void {
    // Update real-time click counters
    const analytics = JSON.parse(localStorage.getItem('click_analytics') || '{}');
    analytics[productId] = (analytics[productId] || 0) + 1;
    localStorage.setItem('click_analytics', JSON.stringify(analytics));
  }

  private updateConversionAnalytics(clickId: string, orderValue: number, commission: number): void {
    // Update conversion analytics
    const conversions = JSON.parse(localStorage.getItem('conversions') || '[]');
    conversions.push({
      click_id: clickId,
      order_value: orderValue,
      commission: commission,
      timestamp: Date.now()
    });
    localStorage.setItem('conversions', JSON.stringify(conversions));
  }

  private async updateClickConversion(clickId: string, orderId: string, orderValue: number, commission: number): Promise<void> {
    // Update click record with conversion data
    const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    const clickIndex = clicks.findIndex((c: any) => c.id === clickId);
    
    if (clickIndex !== -1) {
      clicks[clickIndex] = {
        ...clicks[clickIndex],
        converted: true,
        revenue: orderValue,
        order_id: orderId,
        commission_earned: commission,
        conversion_time: new Date().toISOString()
      };
      
      localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));
    }
  }

  private async updateUserEarnings(userId: string, commission: number): Promise<void> {
    // Update user's total earnings
    const earnings = JSON.parse(localStorage.getItem(`earnings_${userId}`) || '{"total": 0, "pending": 0}');
    earnings.pending += commission;
    localStorage.setItem(`earnings_${userId}`, JSON.stringify(earnings));
  }

  private storeUserSession(userId: string): void {
    localStorage.setItem('findout_user_id', userId);
  }

  private flushPendingEvents(): void {
    // Send any pending tracking events
    const pendingEvents = JSON.parse(sessionStorage.getItem('pending_events') || '[]');
    if (pendingEvents.length > 0) {
      // In production, send to analytics API
      console.log('Flushing pending events:', pendingEvents);
      sessionStorage.removeItem('pending_events');
    }
  }

  // Mock API methods (replace with real API calls in production)
  private async fetchClickAnalytics(_productId?: string, _outfitId?: string, _timeframe: string = '7d') {
    // Mock analytics data
    return {
      total_clicks: Math.floor(Math.random() * 1000),
      unique_clicks: Math.floor(Math.random() * 800),
      conversions: Math.floor(Math.random() * 50),
      total_revenue: Math.floor(Math.random() * 10000),
      total_commission: Math.floor(Math.random() * 1000),
      top_products: [],
      click_sources: [],
      hourly_clicks: []
    };
  }

  private async fetchUserEarnings(userId: string, _period: string) {
    // Mock user earnings data
    const storedEarnings = JSON.parse(localStorage.getItem(`earnings_${userId}`) || '{"total": 0, "pending": 0}');
    return {
      total_earnings: storedEarnings.total,
      pending_earnings: storedEarnings.pending,
      paid_earnings: storedEarnings.total - storedEarnings.pending,
      total_clicks: Math.floor(Math.random() * 500),
      conversions: Math.floor(Math.random() * 25),
      conversion_rate: Math.random() * 10,
      top_outfits: [],
      brand_breakdown: [],
      recent_transactions: [],
      payout_history: []
    };
  }
}

// Export singleton instance
export const affiliateTracker = new AffiliateTrackingService();
export default affiliateTracker;