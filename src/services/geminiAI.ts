import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIAnalysis, ColorAnalysis, StyleProfile } from '../types';

// Initialize Gemini AI with the provided API key - 2025 Gemini 2.5 Flash Configuration
const GEMINI_API_KEY = 'AIzaSyARZyERqMaFInsbRKUA0NxOok77syBNzK8';
const MODEL_NAME = 'gemini-2.5-flash'; // EXACT 2025 model as requested

class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME });
  }

  /**
   * Analyze outfit images using Gemini Vision API with GODLIKE product detection
   */
  async analyzeOutfitImages(images: File[]): Promise<AIAnalysis> {
    try {
      // Convert images to base64 for Gemini API
      const imagePromises = images.map(image => this.fileToBase64(image));
      const base64Images = await Promise.all(imagePromises);

      const prompt = `You are an expert Turkish fashion AI analyst. Analyze this outfit image and provide a comprehensive style analysis.

CRITICAL: Respond with ONLY a valid JSON object. No explanations, no markdown, no thinking process - just the JSON.

Return this exact JSON structure with your analysis:
{
  "style_classification": ["casual", "modern", "chic"],
  "color_analysis": {
    "dominant_colors": ["#000000", "#ffffff", "#cccccc"],
    "color_harmony": "monochromatic",
    "color_temperature": "neutral",
    "contrast_level": "medium",
    "seasonal_palette": "all"
  },
  "fit_assessment": {
    "overall_fit": "good",
    "silhouette_analysis": "Well-fitted contemporary style",
    "proportion_balance": 8,
    "body_flattering_score": 7,
    "size_recommendations": []
  },
  "trend_score": 85,
  "weather_suitability": ["mild", "warm"],
  "occasion_match": ["casual", "daily", "social"],
  "body_type_recommendations": ["all"],
  "style_confidence": 88,
  "generated_tags": ["casual", "comfortable", "stylish", "trendy"],
  "improvement_suggestions": ["Add accessories for more personality"],
  "detected_products": [
    {
      "item_type": "top",
      "name": "Temel Tişört",
      "brand_suggestions": ["Zara", "H&M", "Koton"],
      "estimated_price_range": "89-149",
      "currency": "TRY",
      "color": "#000000",
      "material": "cotton",
      "category": "tops",
      "confidence": 85,
      "shopping_keywords": ["temel tişört", "günlük giyim", "basic top"]
    }
  ]
}

Analyze the actual outfit in the image and replace the example values with real analysis. Focus on Turkish fashion context and brands. Return ONLY the JSON object.`;

      const imageParts = base64Images.map(base64 => ({
        inlineData: {
          data: base64,
          mimeType: 'image/jpeg'
        }
      }));

      // Gemini 2.5 Flash configuration - disable thinking for clean JSON output
      const generationConfig = {
        thinkingConfig: {
          thinkingBudget: 0  // Turn off thinking mode for structured JSON responses
        },
        temperature: 0.1,  // Low temperature for consistent JSON format
        candidateCount: 1
      };

      const result = await this.model.generateContent({
        contents: [{ parts: [{ text: prompt }, ...imageParts] }],
        generationConfig: generationConfig
      });
      
      const response = await result.response;
      const text = response.text();

      console.log('Gemini AI Raw Response:', text); // Debug logging

      // ENHANCED JSON extraction for Gemini 2.5 Flash responses
      let analysis: AIAnalysis;
      try {
        // Method 1: Direct JSON parse (cleanest response)
        analysis = JSON.parse(text);
      } catch {
        try {
          // Method 2: Extract from markdown code blocks
          const codeBlockMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (codeBlockMatch) {
            analysis = JSON.parse(codeBlockMatch[1]);
          } else {
            // Method 3: Extract JSON between thinking sections
            const cleanedText = text.replace(/<thinking>[\s\S]*?<\/thinking>/g, '').trim();
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              analysis = JSON.parse(jsonMatch[0]);
            } else {
              // Method 4: Find the largest JSON-like object
              const allMatches = text.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
              if (allMatches && allMatches.length > 0) {
                const largestMatch = allMatches.reduce((a: string, b: string) => a.length > b.length ? a : b);
                analysis = JSON.parse(largestMatch);
              } else {
                throw new Error('No valid JSON structure found in response');
              }
            }
          }
        } catch (parseError) {
          console.error('All JSON parsing methods failed:', parseError);
          console.error('Raw Gemini 2.5 Flash response:', text);
          console.error('Response length:', text.length);
          console.error('Response preview:', text.substring(0, 500) + '...');
          
          // Fallback: Create mock analysis for development
          analysis = {
            style_classification: ['casual', 'modern'],
            color_analysis: {
              dominant_colors: ['#000000', '#ffffff'],
              color_harmony: 'monochromatic',
              color_temperature: 'neutral',
              contrast_level: 'medium',
              seasonal_palette: 'all'
            },
            fit_assessment: {
              overall_fit: 'good',
              silhouette_analysis: 'Well-fitted casual style',
              proportion_balance: 8,
              body_flattering_score: 7,
              size_recommendations: []
            },
            trend_score: 75,
            weather_suitability: ['mild'],
            occasion_match: ['casual'],
            body_type_recommendations: ['all'],
            style_confidence: 80,
            generated_tags: ['casual', 'comfortable', 'everyday'],
            similar_outfits: [],
            improvement_suggestions: ['Add accessories for more personality'],
            detected_products: [
              {
                item_type: 'top',
                name: 'Casual T-Shirt',
                brand_suggestions: ['Zara', 'H&M'],
                estimated_price_range: '89-149',
                currency: 'TRY',
                color: '#000000',
                material: 'cotton',
                category: 'tops',
                confidence: 85,
                shopping_keywords: ['casual tişört', 'basic top']
              }
            ]
          };
        }
      }
      
      // Add similar outfits (mock for now - would be implemented with vector search)
      analysis.similar_outfits = await this.findSimilarOutfits(analysis);

      return analysis;
    } catch (error) {
      console.error('Gemini AI analysis failed:', error);
      throw new Error('AI analysis failed. Please try again.');
    }
  }

  /**
   * GODLIKE Product Detection - Extract products from AI analysis
   */
  async extractProductsFromAnalysis(analysis: AIAnalysis): Promise<any[]> {
    if (!analysis.detected_products) {
      return []; // Return empty if no products detected
    }

    return analysis.detected_products.map((product: any) => ({
      name: product.name,
      brand: product.brand_suggestions[0] || 'Zara',
      original_url: this.generateProductURL(product.brand_suggestions[0] || 'Zara'),
      price: this.parsePrice(product.estimated_price_range),
      currency: product.currency || 'TRY',
      category: product.category,
      color: product.color,
      material: product.material,
      availability: 'in_stock' as const,
      confidence: product.confidence,
      shopping_keywords: product.shopping_keywords
    }));
  }

  /**
   * Generate realistic product URLs for Turkish brands
   */
  private generateProductURL(brand: string): string {
    const brandURLs: Record<string, string> = {
      'Zara': 'https://zara.com/tr',
      'H&M': 'https://hm.com/tr',
      'Mango': 'https://mango.com/tr',
      'Koton': 'https://koton.com/tr',
      'LC Waikiki': 'https://lcwaikiki.com/tr',
      'DeFacto': 'https://defacto.com.tr',
      'Trendyol': 'https://trendyol.com',
      'Pull & Bear': 'https://pullandbear.com/tr',
      'Bershka': 'https://bershka.com/tr',
      'Stradivarius': 'https://stradivarius.com/tr'
    };
    
    return brandURLs[brand] || 'https://zara.com/tr';
  }

  /**
   * Parse price range and return average price
   */
  private parsePrice(priceRange: string): number {
    const prices = priceRange.split('-').map(p => parseInt(p.trim()));
    if (prices.length === 2) {
      return Math.floor((prices[0] + prices[1]) / 2);
    }
    return prices[0] || 150;
  }

  /**
   * Generate outfit recommendations based on user preferences
   */
  async generateOutfitRecommendations(
    userProfile: StyleProfile,
    occasion: string,
    weather?: string,
    budget?: string
  ): Promise<any[]> {
    try {
      const prompt = `
        Generate 3 outfit recommendations for a Turkish fashion user with the following profile:
        
        Style Profile: ${JSON.stringify(userProfile)}
        Occasion: ${occasion}
        Weather: ${weather || 'not specified'}
        Budget: ${budget || userProfile.budget_range}

        Consider Turkish fashion brands like Trendyol, LC Waikiki, Zara Turkey, H&M Turkey, Mango Turkey.
        
        Respond with JSON array of outfit suggestions:
        [
          {
            "title": "Outfit Name",
            "description": "Why this outfit works",
            "category": "casual|formal|party|etc",
            "items": [
              {
                "type": "top|bottom|dress|shoes|accessory",
                "name": "Item name",
                "brand": "Brand suggestion",
                "color": "#hexcode",
                "price_range": "budget|mid_range|premium",
                "reasoning": "Why this item fits"
              }
            ],
            "total_estimated_price": "₺500-800",
            "style_confidence": 95,
            "weather_appropriate": true,
            "occasion_match": 100
          }
        ]
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid recommendation response format');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Outfit recommendation failed:', error);
      throw new Error('Recommendation generation failed. Please try again.');
    }
  }

  /**
   * Analyze color compatibility for outfit combinations
   */
  async analyzeColorCompatibility(colors: string[]): Promise<ColorAnalysis> {
    try {
      const prompt = `
        Analyze the color compatibility of these colors: ${colors.join(', ')}
        
        Provide analysis in JSON format:
        {
          "dominant_colors": ["#hex1", "#hex2"],
          "color_harmony": "complementary|monochromatic|triadic|analogous",
          "color_temperature": "warm|cool|neutral",
          "contrast_level": "low|medium|high",
          "seasonal_palette": "spring|summer|autumn|winter",
          "compatibility_score": 85,
          "improvement_suggestions": ["suggestion1", "suggestion2"]
        }
        
        Consider color theory principles and current fashion trends.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid color analysis response format');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Color analysis failed:', error);
      throw new Error('Color analysis failed. Please try again.');
    }
  }

  /**
   * Generate style profile from user's outfit history
   */
  async generateStyleProfile(outfitHistory: any[]): Promise<StyleProfile> {
    try {
      const prompt = `
        Analyze this user's outfit history and create a comprehensive style profile:
        
        Outfit History: ${JSON.stringify(outfitHistory.slice(0, 20))} // Limit to recent 20
        
        Generate a style profile in JSON format:
        {
          "primary_style": "minimalist|bohemian|classic|trendy|edgy",
          "secondary_styles": ["style1", "style2"],
          "color_preferences": ["#color1", "#color2"],
          "preferred_brands": ["brand1", "brand2"],
          "budget_range": "budget|mid_range|premium|luxury",
          "lifestyle": ["professional", "social", "active"],
          "fashion_goals": ["comfort", "trendy", "professional"],
          "inspiration_sources": ["street_style", "influencers", "runway"],
          "style_evolution_score": 75,
          "confidence_level": 85,
          "willingness_to_experiment": 60
        }
        
        Base analysis on Turkish fashion preferences and global trends.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid style profile response format');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Style profile generation failed:', error);
      throw new Error('Style profile generation failed. Please try again.');
    }
  }

  /**
   * Visual search - find similar outfits from an uploaded image
   */
  async visualSearch(image: File): Promise<string[]> {
    try {
      const base64Image = await this.fileToBase64(image);

      const prompt = `
        Analyze this fashion image and describe the outfit in detail for search purposes.
        Extract key visual elements, style characteristics, colors, and garment types.
        
        Respond with JSON:
        {
          "description": "Detailed outfit description",
          "key_elements": ["element1", "element2"],
          "style_keywords": ["keyword1", "keyword2"],
          "colors": ["#color1", "#color2"],
          "garment_types": ["dress", "jacket"],
          "search_tags": ["tag1", "tag2"]
        }
        
        Focus on searchable characteristics for finding similar outfits.
      `;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg'
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid visual search response format');
      }

      const searchData = JSON.parse(jsonMatch[0]);
      return searchData.search_tags || [];
    } catch (error) {
      console.error('Visual search failed:', error);
      throw new Error('Visual search failed. Please try again.');
    }
  }

  /**
   * Predict fashion trends based on current data
   */
  async predictTrends(timeframe: '30_days' | '60_days' | '90_days'): Promise<any[]> {
    try {
      const prompt = `
        Predict fashion trends for the next ${timeframe.replace('_', ' ')} based on:
        - Current global fashion trends
        - Turkish fashion market preferences
        - Seasonal considerations
        - Social media influence
        - Economic factors
        
        Respond with JSON array:
        [
          {
            "trend_name": "Trend Name",
            "description": "Detailed description",
            "confidence_score": 85,
            "key_items": ["item1", "item2"],
            "colors": ["#color1", "#color2"],
            "price_impact": "increase|decrease|stable",
            "target_demographic": ["Gen Z", "Millennials"],
            "adoption_timeline": "early|peak|declining",
            "turkish_market_relevance": 90
          }
        ]
        
        Focus on trends relevant to the Turkish market and online fashion.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid trend prediction response format');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Trend prediction failed:', error);
      throw new Error('Trend prediction failed. Please try again.');
    }
  }

  /**
   * Helper: Convert File to base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Helper: Find similar outfits (placeholder for vector search)
   */
  private async findSimilarOutfits(_analysis: AIAnalysis): Promise<string[]> {
    // This would be implemented with vector search in production
    // For now, return mock similar outfit IDs
    return [
      'outfit_123',
      'outfit_456', 
      'outfit_789'
    ];
  }

  /**
   * Chat with AI about fashion advice
   */
  async chatWithFashionAI(message: string, context?: any): Promise<string> {
    try {
      const prompt = `
        You are a Turkish fashion AI assistant for FindOut platform. 
        User message: "${message}"
        Context: ${context ? JSON.stringify(context) : 'No additional context'}
        
        Provide helpful, trendy, and culturally appropriate fashion advice.
        Consider Turkish fashion preferences, local brands, and current trends.
        Be conversational and friendly. Respond in Turkish when appropriate.
        
        Keep responses concise but informative (max 150 words).
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Fashion AI chat failed:', error);
      throw new Error('AI chat failed. Please try again.');
    }
  }
}

// Export singleton instance
export const geminiAI = new GeminiAIService();
export default geminiAI;