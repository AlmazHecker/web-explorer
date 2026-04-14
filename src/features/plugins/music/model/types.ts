export interface TrackMetadata extends Omit<MediaMetadata, "artwork"> {
  artwork: MediaImage;
  lyrics: string;
}
