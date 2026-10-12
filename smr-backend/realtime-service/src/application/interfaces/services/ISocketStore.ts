/**
 * This store stores records of socket connections related to a jounrey and its
 * passenger.
 */
export interface ISocketStore {
  addSocket(journeyId: string, token: string, socketId: string): Promise<void>;
  removeSocket(journeyId: string, token: string): Promise<void>;
  getSocketsByJourney(journeyId: string): Promise<Map<string, string>>;
  getSocketByToken(journeyId: string, token: string): Promise<string | null>;
  clearJourney(journeyId: string): Promise<void>;
}
