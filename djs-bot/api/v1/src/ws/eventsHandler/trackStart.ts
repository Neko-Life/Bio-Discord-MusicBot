import { ESocketEventType } from '../../interfaces/wsShared';
import { wsPublish } from '../../utils/ws';

// this is hilarious
import { IHandleTrackStartParams } from '../../../../../lib/MusicEvents.d';
import { createEventPayload } from '../../utils/wsShared';

export default function handleTrackStart({
  player,
  track,
}: IHandleTrackStartParams) {
  if (!player?.guild?.length) throw new TypeError('Missing guildId');

  const to = 'player/' + player.guild;
  const d = createEventPayload(ESocketEventType.PLAYING, { ...track });

  // !TODO: debug log, remove when done
  console.log({ publish: to, d });

  wsPublish(to, d);
}