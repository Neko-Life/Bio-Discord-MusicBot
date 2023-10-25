import { WebSocket } from 'uWebSockets.js';
import { ESocketErrorCode, ESocketEventType } from '../../interfaces/wsShared';
import { getBot } from '../..';
import { getPlayerQueue, wsPlayerSubscribe, wsSendJson } from '../../utils/ws';
import { IPlayerSocket } from '../../interfaces/ws';
import { createErrPayload, createEventPayload } from '../../utils/wsShared';

export default function handleOpen(ws: WebSocket<IPlayerSocket>) {
  const bot = getBot();
  const wsData = ws.getUserData();
  //            !TODO: WTF IS A `bot.manager`
  const player = bot.manager?.Engine.players.get(wsData.serverId);

  const sendDEmpty = () => {
    const dEmpty = createEventPayload(ESocketEventType.PLAYING);
    const dEmpty2 = createEventPayload(ESocketEventType.PROGRESS, 0);

    wsSendJson(ws, dEmpty);
    wsSendJson(ws, dEmpty2);
  };

  wsPlayerSubscribe(ws);

  const d = createEventPayload(
    ESocketEventType.GET_QUEUE,
    getPlayerQueue(player),
  );
  wsSendJson(ws, d);

  if (!player) {
    sendDEmpty();

    const d2 = createErrPayload(ESocketErrorCode.NOTHING, 'No active player');
    wsSendJson(ws, d2);

    return;
  }

  const playing = player.queue.current;

  if (playing) {
    // track payload
    const d = createEventPayload(ESocketEventType.PLAYING, { ...playing });
    // progress payload
    const d2 = createEventPayload(ESocketEventType.PROGRESS, player.position);

    wsSendJson(ws, d);
    wsSendJson(ws, d2);
  } else sendDEmpty();
}