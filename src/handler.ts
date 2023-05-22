import { Handler } from 'aws-lambda';
import axios, { AxiosRequestHeaders, AxiosResponseHeaders } from 'axios';
import * as Raindrop from './types/raindrop';

export const notify: Handler = async (_event, _context) => {
  const client = new RaindropApiClient(process.env.RAINDROP_ACEESS_KEY || '');
  const raindrops: Raindrop.Raindrop[] = await client.getAllRaindrops();

  // filter raindrops updated yesterday
  const raindropsUpdatedYesterday = raindrops.filter((raindrop: any) => {
    const updatedAt = new Date(raindrop.lastUpdate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return updatedAt > yesterday;
  });

  const text = [
    `昨日のRaindrop.ioの更新数: ${raindropsUpdatedYesterday.length}`,
  ];
  const payload = {
    text: text.join('\n'),
  };

  // send to slack
  await axios.post(process.env.SLACK_WEBHOOK_URL || '', payload);
};

class RaindropApiClient {
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

  /**
   * get all root collections
   * @returns {Promise<Raindrop.RaindropCollection[]>}
   */
  private async getAllRootCollections(): Promise<
    Raindrop.RaindropCollection[]
  > {
    const reqUri: string = 'https://api.raindrop.io/rest/v1/collections/';
    const response = await axios.get(reqUri, { headers: this.header });
    return response.data.items;
  }

  /**
   * get raindrops by collection id
   * @param {number} collectionId
   * @returns {Promise<Raindrop.Raindrop[]>}
   */
  private async getRaindrops(
    collectionId: number
  ): Promise<Raindrop.Raindrop[]> {
    const reqUri: string = `${this.getRaindropsUri}${collectionId}`;
    const response = await axios.get(reqUri, { headers: this.header });
    return response.data.items;
  }

  /**
   * get all raindrops
   * @returns {Promise<Raindrop.Raindrop[]>}
   */

  async getAllRaindrops(): Promise<Raindrop.Raindrop[]> {
    const rootCollections = await this.getAllRootCollections();
    const raindrops = await Promise.all(
      rootCollections.map(async (collection: any) => {
        return await this.getRaindrops(collection._id);
      })
    );
    return raindrops.flat();
  }
}
