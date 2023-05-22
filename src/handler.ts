import { Handler } from 'aws-lambda';
import axios, { AxiosRequestHeaders, AxiosResponseHeaders } from 'axios';

export const notify: Handler = async (_event, _context) => {
  const client = new ApiClient(process.env.RAINDROP_ACEESS_KEY || '');
  const raindrops = await client.getAllRaindrops();

  const raindropsUpdatedYesterday = raindrops.filter((raindrop: any) => {
    const updatedAt = new Date(raindrop.lastUpdate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return updatedAt > yesterday;
  });
};

class ApiClient {
  private readonly header;
  private readonly getRaindropsUri: string =
    'https://api.raindrop.io/rest/v1/raindrops/';

  constructor(private readonly authKey: string) {
    this.authKey = authKey;
    this.header = {
      Authorization: `Bearer ${this.authKey}`,
      'Content-Type': 'application/json',
    };
  }

  private async getAllRootCollections() {
    const reqUri: string = 'https://api.raindrop.io/rest/v1/collections/';
    const response = await axios.get(reqUri, { headers: this.header });
    return response.data.items;
  }

  private async getRaindrops(collectionId: number) {
    const reqUri: string = `${this.getRaindropsUri}${collectionId}`;
    const response = await axios.get(reqUri, { headers: this.header });
    return response.data.items;
  }

  async getAllRaindrops() {
    const rootCollections = await this.getAllRootCollections();
    const raindrops = await Promise.all(
      rootCollections.map(async (collection: any) => {
        return await this.getRaindrops(collection._id);
      })
    );
    return raindrops.flat();
  }
}
