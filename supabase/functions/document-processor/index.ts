import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentProcessingRequest {
  fileUrl: string;
  fileName: string;
  fileType: string;
  entityType?: string;
  entityId?: string;
  processingOptions?: {
    extractText?: boolean;
    generateSummary?: boolean;
    detectLanguage?: boolean;
    extractKeywords?: boolean;
    analyzeContent?: boolean;
  };
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
      fileUrl,
      fileName,
      fileType,
      entityType,
      entityId,
      processingOptions = {
        extractText: true,
        generateSummary: true,
        detectLanguage: true,
        extractKeywords: true,
        analyzeContent: true
      }
    }: DocumentProcessingRequest = await req.json();

    console.log('Processing document:', {
      fileName,
      fileType,
      entityType,
      entityId,
      options: processingOptions
    });

    // Download and process the file
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.statusText}`);
    }

    const fileBuffer = await fileResponse.arrayBuffer();
    const fileSize = fileBuffer.byteLength;

    // Extract text based on file type
    let extractedText = '';
    
    if (fileType.includes('text') || fileType.includes('plain')) {
      const decoder = new TextDecoder();
      extractedText = decoder.decode(fileBuffer);
    } else if (fileType.includes('pdf')) {
      // For PDF, we'd typically use a PDF parsing library
      // For now, we'll create a placeholder
      extractedText = 'PDF text extraction would require additional libraries';
    } else if (fileType.includes('word') || fileType.includes('docx')) {
      // For Word documents, we'd use a specific parser
      extractedText = 'Word document text extraction would require additional libraries';
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    const results: any = {
      fileName,
      fileType,
      fileSize,
      extractedText: processingOptions.extractText ? extractedText : null
    };

    // Process with AI if OpenAI is available
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (openaiApiKey && extractedText && extractedText.length > 10) {
      const aiResults = await processWithAI(extractedText, processingOptions, openaiApiKey);
      Object.assign(results, aiResults);
    }

    // Save processing results
    const { data: processedDoc, error: saveError } = await supabaseClient
      .from('document_processing_results')
      .insert({
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        file_url: fileUrl,
        extracted_text: extractedText.substring(0, 10000), // Limit stored text
        processing_results: results,
        entity_type: entityType,
        entity_id: entityId,
        processed_at: new Date().toISOString(),
        processing_status: 'completed'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving processing results:', saveError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        processingId: processedDoc?.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in document-processor:', error);
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

async function processWithAI(text: string, options: any, apiKey: string) {
  const results: any = {};

  try {
    // Generate summary if requested
    if (options.generateSummary && text.length > 100) {
      const summaryPrompt = `Summarize the following text in Arabic and English. Keep it concise but comprehensive:

${text.substring(0, 2000)}

Provide the summary in this format:
Arabic Summary: [Arabic text]
English Summary: [English text]`;

      const summaryResponse = await callOpenAI(summaryPrompt, apiKey);
      results.summary = summaryResponse;
    }

    // Extract keywords if requested
    if (options.extractKeywords) {
      const keywordsPrompt = `Extract the most important keywords and topics from this text. Provide them in both Arabic and English:

${text.substring(0, 1500)}

Format:
Keywords (Arabic): [keyword1, keyword2, keyword3...]
Keywords (English): [keyword1, keyword2, keyword3...]`;

      const keywordsResponse = await callOpenAI(keywordsPrompt, apiKey);
      results.keywords = keywordsResponse;
    }

    // Detect language if requested
    if (options.detectLanguage) {
      const languages = detectLanguages(text);
      results.detectedLanguages = languages;
    }

    // Analyze content if requested
    if (options.analyzeContent) {
      const analysisPrompt = `Analyze this document and provide:
1. Document type/category
2. Main topics covered
3. Tone (formal/informal/technical/etc.)
4. Target audience
5. Key insights

Text:
${text.substring(0, 2000)}`;

      const analysisResponse = await callOpenAI(analysisPrompt, apiKey);
      results.contentAnalysis = analysisResponse;
    }

  } catch (error) {
    console.error('Error in AI processing:', error);
    results.aiProcessingError = error.message;
  }

  return results;
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful document analysis assistant that provides accurate and useful insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.choices[0]?.message?.content?.trim() || '';
}

function detectLanguages(text: string): string[] {
  const languages: string[] = [];
  
  // Simple language detection based on character patterns
  const arabicPattern = /[\u0600-\u06FF]/;
  const englishPattern = /[a-zA-Z]/;
  
  if (arabicPattern.test(text)) {
    languages.push('ar');
  }
  
  if (englishPattern.test(text)) {
    languages.push('en');
  }
  
  return languages.length > 0 ? languages : ['unknown'];
}

serve(handler);