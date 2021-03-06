import { validator$, Joi } from '../../src';
import { of } from 'rxjs';
import { HttpRequest, HttpResponse, RouteParameters, QueryParameters } from '@marblejs/core';

const reqMatched = (
  url: string,
  matchers: string[] = [],
  params: RouteParameters = {},
  query: QueryParameters = {},
) => ({ url, matchers, params, query } as any as HttpRequest);

describe('Joi middleware - Query', () => {
  it('should throws an error if dont pass a required field', done => {
    expect.assertions(2);

    const req$ = of(reqMatched('/test', null, {}, {}));
    const res = {} as HttpResponse;
    const schema = {
      query: Joi.object({
        id: Joi.string()
          .token()
          .required()
      })
    };
    const http$ = validator$(schema)(req$, res, {});

    http$.subscribe(
      () => {
        fail('Exceptions should be thrown');
        done();
      },
      error => {
        expect(error).toBeDefined();
        expect(error.message).toBe('"id" is required');
        done();
      }
    );
  });

  it('should throws an error if pass a invalid field', done => {
    expect.assertions(2);

    const req$ = of(reqMatched('/test', null, {}, { id: '@@@' }));
    const res = {} as HttpResponse;
    const schema = {
      query: Joi.object({
        id: Joi.string().token()
      })
    };
    const http$ = validator$(schema)(req$, res, {});

    http$.subscribe(
      () => {
        fail('Exceptions should be thrown');
        done();
      },
      error => {
        expect(error).toBeDefined();
        expect(error.message).toBe(
          '"id" must only contain alpha-numeric and underscore characters'
        );
        done();
      }
    );
  });

  it('should validates query with a valid value', done => {
    expect.assertions(2);

    const req$ = of(reqMatched('/test', null, {}, { id: '181782881DB38D84' }));
    const res = {} as HttpResponse;
    const schema = {
      query: Joi.object({
        id: Joi.string().token()
      })
    };
    const http$ = validator$(schema)(req$, res, {});

    http$.subscribe(data => {
      expect(data).toBeDefined();
      expect(data.query).toEqual({ id: '181782881DB38D84' });
      done();
    });
  });
});
