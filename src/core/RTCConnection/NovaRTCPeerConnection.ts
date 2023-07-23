class NovaRTCPeerConnection extends RTCPeerConnection {
  constructor(options: RTCConfiguration) {
    super(options);
  }

  /**
   * 创建一个offer、完成description 设置
   */
  async initConnectionOffer(options: RTCOfferOptions) {
    const offer = await this.createOffer(options);
    const localDescription = new RTCSessionDescription(offer);
    this.setLocalDescription(localDescription);
    return offer;
  }

  /**
   * 接受一个远端offer、完成description 设置、创建answer
   */
  async initConnectionAnswer(offer: RTCSessionDescriptionInit) {
    const remoteDescription = new RTCSessionDescription(offer);
    await this.setRemoteDescription(remoteDescription);
    const answer = await this.createAnswer();
    await this.setLocalDescription(new RTCSessionDescription(answer));
    return answer;
  }
}
