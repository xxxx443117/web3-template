import { cloneDeep } from "lodash";
// import { Api } from 'apis';
// import { ResponseCode } from 'apis/type';
import mitt from "mitt";

export enum MessageProtocol {
  // 报错
  WSProtocol_ERROR = 0,

  Chat = "chat",
  Unsubscribe = "unsubscribe",

  // 心跳检测
  WSProtocol_HEART_Jump_Jump = 97, // 作者是97年生的 每分钟要心跳97下
}

export enum SubscribeType {
  MarketSpot1 = "market@spot_1",
}

enum WSReadyState {
  CONNECTING = 0,
  OPEN,
  CLOSING,
  CLOSED,
}

interface SendMessageData {
  method: MessageProtocol;
  content: any;
  address: string;
  nonce: number;
}

enum ImEventType {
  MESSAGE = "message",
  CLOSE = "close",
  ERROR = "error",
  OPEN = "open",
  SUBSCRIBE = "subscribe",
  SPEND_TIME = "spendTime",
  UNREAD_NOTIFY = "unreadNotify",
}

interface ResponseMessageData {
  code: number;
  data: unknown;
  msg: string;
  nonce: number;
}

type EventType = "message" | "close" | "error" | "open";

type Handle<T> = (event: T) => void;
interface HandleEvent<T> {
  handle: Handle<T>;
  event: EventType;
}

export class NiubiWS {
  connection?: WebSocket;
  interval: any;
  // url: string = `ws://192.168.101.112:8888/v1/ws`;
  url: string;
  token: string;

  expires: number = 0;
  pingIntervalSeconds = 10_000; // 心跳连接时间
  loading = false;

  emitter;

  reTimer: any = null; // 重连timer

  waitMessageList: SendMessageData[] = [];
  handleEvents: HandleEvent<unknown>[] = [];
  endConnect: boolean = false; // 是否结束链接
  nonce = 0; // Nonce, 类似消息ID

  opened = false;

  private suspendTpl: MessageProtocol[] = []; // 暂停的交互(不向后端发送此tpl的消息)

  addSuspendTpl(...arg: MessageProtocol[]) {
    this.suspendTpl = this.suspendTpl.concat(arg);
  }
  removeSuspendTpl(...arg: MessageProtocol[]) {
    this.suspendTpl = this.suspendTpl.filter((item) => !arg.includes(item));
  }

  // 消息协议
  static MessageProtocol = MessageProtocol;
  messageProtocol = MessageProtocol; // 方便在子组件调用

  // 事件类型
  static EventType = ImEventType;
  eventType = ImEventType; // 方便在子组件调用

  constructor(options: { url?: string; token?: string }) {
    this.emitter = mitt();
    this.url = options.url ?? "";
    this.token = options.token ?? "";

    this.endConnect = false;
    this.loading = true;

    this.init(this.url);
  }

  init(url?: string, token?: string) {
    if (!url) {
      return;
    }

    this.url = url ?? this.url;
    this.token = token ?? this.token;
    if (this.connection) {
      this.connection.close();
      this.opened = false;
    }

    this.connection = new WebSocket(`${this.url}/${this.token}`);

    this.connection.onopen = (event) => {
      this.onopenHandle(event);
    };
    this.connection.onmessage = (result) => {
      this.onmessageHandle(result);
    };
    this.connection.onerror = (result) => {
      this.onerrorHandle(result);
    };
    this.connection.onclose = this.oncloseHandle.bind(this);

    this.sendHeart();
  }

  // 关闭socket
  close(endConnect?: boolean) {
    if (this.connection) {
      this.connection.close();
      this.endConnect = endConnect ?? false;
    }
  }

  /**
   *
   * @param ptl 发送协议
   * @param data 发送数据
   * @param needWait 是否需要在重连后重新发送
   */
  send(ptl: MessageProtocol, data?: { content: any, address: string }, needWait?: boolean) {
    if (this.suspendTpl.includes(ptl)) return;
    this.nonce += 1;

    const sendData = {
      method: ptl,
      content: data?.content,
      address: data?.address ?? '',
      nonce: this.nonce,
    };
    if (this.opened) {
      this.connection?.send(JSON.stringify(sendData));
      // this.connection?.send(data);
      return;
    }
    // 添加到等待发送队列
    if (needWait) {
      this.waitMessageList.push(cloneDeep(sendData));
    }
  }

  sendHeart() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.opened) {
        this.send(NiubiWS.MessageProtocol.WSProtocol_HEART_Jump_Jump);
      }
    }, this.pingIntervalSeconds);
  }

  //   async getToken() {
  //     const { token, expires } = await Api.CommonApi.getWsUrl();
  //     this.token = token;
  //     this.expires = expires;
  //     return token;
  //   }

  /**
   * @dev 绑定事件
   * @deprecated 废弃 建议直接使用 addEventListener
   * @param event 事件名
   * @param handle 事件句柄
   */
  on(event: EventType, handle: Handle<unknown>) {
    this.emitter.on(event, handle);
    this.handleEvents.push({
      event,
      handle,
    });
  }

  /**
   * @dev 移除事件绑定
   * @deprecated 废弃 建议直接使用 removeEventListener
   * @param event 事件名
   * @param handle 事件句柄
   */
  remove(event: EventType, handle: Handle<unknown>) {
    this.emitter.off(event, handle);
    this.handleEvents.push({
      event,
      handle,
    });
  }

  // 重新绑定事件
  // reBindEvents() {
  //   this.handleEvents.forEach(({ event, handle }) => {
  //     this.addEventListener(event, handle)
  //   })
  // }

  private onopenHandle(event: any) {
    this.loading = false;
    this.opened = true;
    if (this.reTimer) clearTimeout(this.reTimer);
    this.emitter.emit(ImEventType.OPEN, event);
    this.waitMessageList.forEach((item) => {
      this.send(item.method, item.content, true);
    });
  }

  private parseMessage(event: any) {
    // const data = JSON.parse(event.data);
    // // const data = event.data;
    // const isSuccess = this.parseMessageCode(data);
    // if (!isSuccess) return;
    this.emitter.emit(ImEventType.SUBSCRIBE, {
      data: event.data,
    });
    // switch (data.subscribe  ) {
    //   case SubscribeType.MarketSpot1:
    //     this.dispatchEvent(
    //       new MessageEvent(ImEventType.SUBSCRIBE, {
    //         data,
    //         origin: event.origin,
    //         lastEventId: event.lastEventId,
    //         source: event.source,
    //       })
    //     );
    //     break;
    //   // case WS.MessageProtocol.WSProtocol_Spend_Time:
    //   //   this.dispatchEvent(
    //   //     new MessageEvent(ImEventType.SPEND_TIME, {
    //   //       data,
    //   //       origin: event.origin,
    //   //       lastEventId: event.lastEventId,
    //   //       source: event.source,
    //   //     })
    //   //   );
    //   //   break;
    //   // case WS.MessageProtocol.WSProtocol_Spend_TimeV2:
    //   //   this.dispatchEvent(
    //   //     new MessageEvent(ImEventType.SPEND_TIME, {
    //   //       data,
    //   //       origin: event.origin,
    //   //       lastEventId: event.lastEventId,
    //   //       source: event.source,
    //   //     })
    //   //   );
    //   //   break;
    //   // case WS.MessageProtocol.WSProtocol_UNREAD_NOTIFY:
    //   //   this.dispatchEvent(
    //   //     new MessageEvent(ImEventType.UNREAD_NOTIFY, {
    //   //       data,
    //   //       origin: event.origin,
    //   //       lastEventId: event.lastEventId,
    //   //       source: event.source,
    //   //     })
    //   //   );
    //   //   break;
    //   case WS.MessageProtocol.WSProtocol_HEART_Jump_Jump:
    //     // 心跳检测 不做处理
    //     break;
    //   default:
    //     console.debug("unread ws code: ", data);
    //     break;
    // }
  }

  private parseMessageCode(data: ResponseMessageData): boolean {
    if (data.code !== 200) {
      return false;
    }
    // switch (data.code) {
    //   case ResponseCode.INSUFFICIENT_BALANCE:
    //     eventBus.dispatchEvent(
    //       new MessageEvent('insufficient', {
    //         data,
    //       }),
    //     );
    //     this.addSuspendTpl(this.messageProtocol.WSProtocol_Spend_Time);
    //     return false;
    //   case 0:
    //     // eventBus.dispatchEvent(
    //     //   new MessageEvent('insufficient', {
    //     //     data
    //     //   })
    //     // )
    //     return false;
    //   default:
    //     return true;
    // }
    return true;
  }

  private onmessageHandle(event: any) {
    this.emitter.emit(ImEventType.MESSAGE, {
      data: event.data,
    });
    this.waitMessageList = this.waitMessageList.filter(
      (item) => item.nonce !== event.data.nonce
    );
    this.parseMessage(event);
  }

  private onerrorHandle(event: any) {
    this.loading = false;
    this.emitter.emit(ImEventType.ERROR, event);
  }

  private oncloseHandle(event: CloseEvent) {
    this.emitter.emit(ImEventType.CLOSE, event);
    this.reConnectionWs();
  }

  private reConnectionWs() {
    if (this.endConnect || this.loading) return;
    if (this.reTimer) clearTimeout(this.reTimer);
    this.reTimer = setTimeout(() => {
      if (this.connection) {
        this.connection.close();
      }
      this.init(this.url);
    }, 3000);
  }
}