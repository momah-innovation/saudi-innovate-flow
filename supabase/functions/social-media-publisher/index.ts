import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SocialShareRequest {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'whatsapp';
  content: {
    text: string;
    url?: string;
    imageUrl?: string;
    hashtags?: string[];
  };
  entityId: string;
  entityType: string;
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      platform, 
      content, 
      entityId, 
      entityType, 
      userId 
    }: SocialShareRequest = await req.json();

    console.log('Publishing to social media:', { platform, entityType, entityId });

    // Generate share URL based on platform
    let shareUrl = '';
    const baseUrl = content.url || `${Deno.env.get('SUPABASE_URL')}/dashboard`;
    const text = encodeURIComponent(content.text);
    const hashtags = content.hashtags?.join(',') || '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(baseUrl)}`;
        if (hashtags) {
          shareUrl += `&hashtags=${encodeURIComponent(hashtags)}`;
        }
        break;

      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(baseUrl)}&title=${text}`;
        break;

      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}&quote=${text}`;
        break;

      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${encodeURIComponent(baseUrl)}`;
        break;

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Log the share activity
    if (userId) {
      await supabaseClient
        .from('analytics_events')
        .insert({
          user_id: userId,
          event_type: 'social_share',
          event_category: 'sharing',
          entity_type: entityType,
          entity_id: entityId,
          properties: {
            platform,
            content: content.text,
            hashtags: content.hashtags
          },
          page_url: content.url
        });

      // Update share count for the entity
      const shareTableMap: Record<string, string> = {
        'challenge': 'challenge_shares',
        'idea': 'idea_shares',
        'event': 'event_shares',
        'opportunity': 'opportunity_shares'
      };

      const shareTable = shareTableMap[entityType];
      if (shareTable) {
        await supabaseClient
          .from(shareTable)
          .insert({
            [`${entityType}_id`]: entityId,
            user_id: userId,
            share_method: platform,
            shared_to: platform
          });
      }
    }

    // For platforms that support direct posting (would require API keys)
    let directPostResult = null;
    
    // LinkedIn direct posting (if LinkedIn API key is available)
    const linkedinToken = Deno.env.get('LINKEDIN_ACCESS_TOKEN');
    if (platform === 'linkedin' && linkedinToken) {
      try {
        const linkedinResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${linkedinToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            author: `urn:li:person:${Deno.env.get('LINKEDIN_PERSON_ID')}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: content.text
                },
                shareMediaCategory: 'NONE'
              }
            },
            visibility: {
              'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
          }),
        });

        if (linkedinResponse.ok) {
          directPostResult = await linkedinResponse.json();
        }
      } catch (linkedinError) {
        console.error('LinkedIn direct posting failed:', linkedinError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        shareUrl,
        platform,
        directPost: directPostResult ? true : false,
        directPostId: directPostResult?.id || null,
        message: 'Social share URL generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in social-media-publisher:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);