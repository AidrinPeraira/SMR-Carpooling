export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private iceCandidateQueue: RTCIceCandidateInit[] = [];

  constructor(
    private readonly onIceCandidate: (candidate: RTCIceCandidate) => void,
    private readonly onTrack: (stream: MediaStream) => void
  ) {}

  async startLocalStream(): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      return this.localStream;
    } catch (error) {
      console.error("Error accessing microphone", error);
      throw error;
    }
  }

  createPeerConnection(): void {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ],
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.onIceCandidate(event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.onTrack(event.streams[0]);
      }
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) this.createPeerConnection();
    const offer = await this.peerConnection!.createOffer();
    await this.peerConnection!.setLocalDescription(offer);
    return offer;
  }

  async handleOffer(offer: unknown): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) this.createPeerConnection();
    await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer as RTCSessionDescriptionInit));
    await this.processIceCandidateQueue();
    const answer = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answer);
    return answer;
  }

  async handleAnswer(answer: unknown): Promise<void> {
    if (this.peerConnection) {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer as RTCSessionDescriptionInit));
      await this.processIceCandidateQueue();
    }
  }

  async handleIceCandidate(candidateInit: unknown): Promise<void> {
    if (this.peerConnection?.remoteDescription) {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidateInit as RTCIceCandidateInit));
    } else {
      this.iceCandidateQueue.push(candidateInit as RTCIceCandidateInit);
    }
  }

  private async processIceCandidateQueue() {
    if (this.peerConnection?.remoteDescription) {
      for (const candidate of this.iceCandidateQueue) {
        try {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding queued ICE candidate", e);
        }
      }
      this.iceCandidateQueue = [];
    }
  }

  stop(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.iceCandidateQueue = [];
  }
}
