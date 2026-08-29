import { io, Socket } from "socket.io-client";
import { 
  AcceptCallRequestDTO, 
  IncomingCallPayload, 
  InitiateCallRequestDTO, 
  RejectCallRequestDTO, 
  RelayCallSignalRequestDTO 
} from "../types/CallTypes";

export class CallSocketService {
  private socket: Socket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(userId: string): void {
    if (this.socket?.connected) return;

    this.socket = io(this.url, {
      auth: { userId },
      transports: ["websocket", "polling"],
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  initiateCall(payload: Omit<InitiateCallRequestDTO, "callerId">): void {
    if (this.socket) {
      this.socket.emit("initiate_call", payload);
    }
  }

  acceptCall(payload: AcceptCallRequestDTO): void {
    if (this.socket) {
      this.socket.emit("accept_call", payload);
    }
  }

  rejectCall(payload: RejectCallRequestDTO): void {
    if (this.socket) {
      this.socket.emit("reject_call", payload);
    }
  }

  endCall(callSessionId: string): void {
    if (this.socket) {
      this.socket.emit("end_call", { callSessionId });
    }
  }

  relaySignal(payload: Omit<RelayCallSignalRequestDTO, "senderUserId">): void {
    if (this.socket) {
      this.socket.emit("relay_signal", payload);
    }
  }

  onIncomingCall(callback: (payload: IncomingCallPayload) => void): void {
    if (this.socket) this.socket.on("call-incoming", callback);
  }

  onCallAccepted(callback: (payload: { callSessionId: string; receiverId?: string; callerId?: string }) => void): void {
    if (this.socket) this.socket.on("call-accepted", callback);
  }

  onCallRejected(callback: (payload: { callSessionId: string; message: string }) => void): void {
    if (this.socket) this.socket.on("call-rejected", callback);
  }

  onCallEnded(callback: (payload: { callSessionId: string }) => void): void {
    if (this.socket) this.socket.on("call-ended", callback);
  }

  onCallBusy(callback: (payload: { message: string }) => void): void {
    if (this.socket) this.socket.on("call-busy", callback);
  }

  onCallError(callback: (payload: { message: string }) => void): void {
    if (this.socket) this.socket.on("call-error", callback);
  }

  onCallSignal(callback: (payload: RelayCallSignalRequestDTO) => void): void {
    if (this.socket) this.socket.on("call-signal", callback);
  }

  offAll(): void {
    if (this.socket) {
      this.socket.removeAllListeners("call-incoming");
      this.socket.removeAllListeners("call-accepted");
      this.socket.removeAllListeners("call-rejected");
      this.socket.removeAllListeners("call-ended");
      this.socket.removeAllListeners("call-busy");
      this.socket.removeAllListeners("call-error");
      this.socket.removeAllListeners("call-signal");
    }
  }
}
