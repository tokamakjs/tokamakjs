declare module 'fetch-mock-jest' {
  import { FetchMockStatic, MockCall } from 'fetch-mock';

  interface FetchMockJestStatic extends Omit<FetchMockStatic, 'mock'> {
    mockClear: FetchMockStatic['resetHistory'];
    mockReset: FetchMockStatic['reset'];
    mock: jest.MockContext<Response, MockCall>;
  }

  const fetchMock: FetchMockJestStatic;

  export = fetchMock;
}
