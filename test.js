const { Worker } = require('worker_threads');
const cliColor = require('cli-color');

// Mock dependencies
jest.mock('worker_threads', () => {
  return {
      Worker: jest.fn().mockImplementation(() => ({
            postMessage: jest.fn(),
                })),
                    isMainThread: true
                      };
                      });

                      jest.mock('readline-sync', () => ({
                        question: jest.fn(() => 'exit') // Default mock user input
                        }));

                        jest.mock('cli-color', () => ({
                          magenta: jest.fn((s) => s),
                            green: jest.fn((s) => s),
                              yellow: jest.fn((s) => s),
                                cyan: jest.fn((s) => s),
                                  red: jest.fn((s) => s)
                                  }));

                                  jest.mock('beepbeep', () => jest.fn());
                                  jest.mock('../GameController/gameController.js', () => ({
                                    InitializeShips: jest.fn(() => [
                                        { name: 'Destroyer', size: 2, addPosition: jest.fn() },
                                            { name: 'Submarine', size: 3, addPosition: jest.fn() }
                                              ]),
                                                CheckIsHit: jest.fn(() => false)
                                                }));

                                                jest.mock('../GameController/position.js', () =>
                                                  jest.fn().mockImplementation((col, row) => ({ column: col, row, toString: () => `${col}${row}` }))
                                                  );

                                                  jest.mock('../GameController/letters.js', () => ({
                                                    get: jest.fn((key) => key),
                                                      A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', H: 'H'
                                                      }));

                                                      const Battleship = require('../battleship.js');

                                                      describe('Battleship', () => {
                                                        beforeEach(() => {
                                                            jest.clearAllMocks();
                                                              });

                                                                test('should start the game and initialize telemetry worker', () => {
                                                                    const game = new Battleship();
                                                                        game.setBoardSize = jest.fn();
                                                                            game.InitializeGame = jest.fn();
                                                                                game.StartGame = jest.fn();

                                                                                    game.start();

                                                                                        // Verify the worker is created
                                                                                            expect(Worker).toHaveBeenCalledWith('./TelemetryClient/telemetryClient.js');

                                                                                                // Get the instance that was created
                                                                                                    const mockWorkerInstance = Worker.mock.results[0].value;

                                                                                                        // Check telemetry messages
                                                                                                            expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith({
                                                                                                                  eventName: 'ApplicationStarted',
                                                                                                                        properties: { Technology: 'Node.js' }
                                                                                                                            });

                                                                                                                                // Check initialization sequence
                                                                                                                                    expect(game.setBoardSize).toHaveBeenCalled();
                                                                                                                                        expect(game.InitializeGame).toHaveBeenCalled();
                                                                                                                                            expect(game.StartGame).toHaveBeenCalled();
                                                                                                                                              });
                                                                                                                                              });
                                                                                                                                              