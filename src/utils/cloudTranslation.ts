const {TranslationServiceClient} = require('@google-cloud/translate');
const translationClient = new TranslationServiceClient();

export async function translateText(text: string): Promise<string> {
    // Construct request
    const request = {
      parent: `projects/spotify-lingo/locations/global`,
      contents: [text],
      mimeType: 'text/plain', // mime types: text/plain, text/html
      sourceLanguageCode: 'ja',
      targetLanguageCode: 'en',
    };

    const [response] = await translationClient.translateText(request);

    return response.translations[0].translatedText
}