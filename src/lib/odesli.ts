import { proxyApi } from './api';

export interface OdesliPlatform {
  key: string;
  name: string;
  url?: string;
}

export interface OdesliResponse {
  entityUniqueId: string;
  userCountry: string;
  pageUrl: string;
  linksByPlatform: {
    [key: string]: {
      url: string;
      nativeAppUriMobile?: string;
      nativeAppUriDesktop?: string;
      entityUniqueId: string;
    };
  };
  entitiesByUniqueId: {
    [key: string]: {
      id: string;
      type: string;
      title?: string;
      artistName?: string;
      thumbnailUrl?: string;
      thumbnailWidth?: number;
      thumbnailHeight?: number;
      apiProvider: string;
      platforms: string[];
    };
  };
}

export interface SmartlinkData {
  title: string;
  artist: string;
  imageUrl: string;
  platforms: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    youtubeMusic?: string;
    deezer?: string;
    amazonMusic?: string;
    tidal?: string;
    soundcloud?: string;
    pandora?: string;
    napster?: string;
    audiomack?: string;
    anghami?: string;
    boomplay?: string;
  };
}

class OdesliService {
  private platformMapping = {
    spotify: 'spotify',
    appleMusic: 'itunes',
    youtube: 'youtube',
    youtubeMusic: 'youtubeMusic',
    deezer: 'deezer',
    amazonMusic: 'amazon',
    tidal: 'tidal',
    soundcloud: 'soundcloud',
    pandora: 'pandora',
    napster: 'napster',
    audiomack: 'audiomack',
    anghami: 'anghami',
    boomplay: 'boomplay',
  };

  private platformNames = {
    spotify: 'Spotify',
    appleMusic: 'Apple Music',
    youtube: 'YouTube',
    youtubeMusic: 'YouTube Music',
    deezer: 'Deezer',
    amazonMusic: 'Amazon Music',
    tidal: 'Tidal',
    soundcloud: 'SoundCloud',
    pandora: 'Pandora',
    napster: 'Napster',
    audiomack: 'Audiomack',
    anghami: 'Anghami',
    boomplay: 'Boomplay',
  };

  async fetchSmartlinkData(url: string): Promise<SmartlinkData> {
    try {
      // Utiliser le proxy backend sécurisé au lieu du service tiers
      const data: OdesliResponse = await proxyApi.getOdesliData(url);
      return this.transformResponse(data);
    } catch (error) {
      console.error('Erreur API Odesli:', error);
      throw new Error(
        error instanceof Error 
          ? `Erreur lors de la récupération des liens: ${error.message}`
          : 'Erreur inconnue lors de la récupération des liens'
      );
    }
  }

  private transformResponse(data: OdesliResponse): SmartlinkData {
    // Get the primary entity (usually the first one)
    const entityId = data.entityUniqueId;
    const entity = data.entitiesByUniqueId[entityId];

    if (!entity) {
      throw new Error('Aucune métadonnée trouvée pour ce lien');
    }

    // Extract metadata
    const title = entity.title || 'Titre inconnu';
    const artist = entity.artistName || 'Artiste inconnu';
    const imageUrl = entity.thumbnailUrl || '';

    // Extract platform links
    const platforms: SmartlinkData['platforms'] = {};
    
    Object.entries(this.platformMapping).forEach(([ourKey, odesliKey]) => {
      const platformData = data.linksByPlatform[odesliKey];
      if (platformData?.url) {
        platforms[ourKey as keyof SmartlinkData['platforms']] = platformData.url;
      }
    });

    return {
      title,
      artist,
      imageUrl,
      platforms,
    };
  }

  async isValidMusicUrl(url: string): Promise<boolean> {
    try {
      const result = await proxyApi.validateMusicUrl(url);
      return result.valid;
    } catch (error) {
      // Fallback vers la validation côté client si l'API échoue
      return this.isValidMusicUrlLocal(url);
    }
  }

  private isValidMusicUrlLocal(url: string): boolean {
    const musicDomains = [
      'spotify.com',
      'music.apple.com',
      'youtube.com',
      'youtu.be',
      'music.youtube.com',
      'deezer.com',
      'music.amazon.',
      'tidal.com',
      'soundcloud.com',
      'pandora.com',
      'napster.com',
      'audiomack.com',
      'anghami.com',
      'boomplay.com',
    ];

    try {
      const urlObj = new URL(url);
      return musicDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  }

  getPlatformName(key: string): string {
    return this.platformNames[key as keyof typeof this.platformNames] || key;
  }

  getAvailablePlatforms(): Array<{ key: string; name: string }> {
    return Object.entries(this.platformNames).map(([key, name]) => ({
      key,
      name,
    }));
  }

  async getSupportedPlatforms() {
    try {
      return await proxyApi.getSupportedPlatforms();
    } catch (error) {
      console.error('Erreur lors de la récupération des plateformes supportées:', error);
      return { platforms: [], total: 0 };
    }
  }
}

export const odesliService = new OdesliService();