/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Nature } from '../models/Nature';
import type { Pokemon } from '../models/Pokemon';
import type { Stat } from '../models/Stat';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Retrieves Pokémon by ID
     * Returns data of a Pokémon specified by its ID.
     * @param id The ID of the Pokémon.
     * @returns Pokemon A Pokémon object.
     * @throws ApiError
     */
    public static getPokemonById(
        id: number,
    ): CancelablePromise<Pokemon> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pokemon/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Retrieves stat by ID
     * Returns data of a stat specified by its ID.
     * @param id The ID of the stat.
     * @returns Stat A stat object.
     * @throws ApiError
     */
    public static getStatById(
        id: number,
    ): CancelablePromise<Stat> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stat/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Retrieves nature by ID
     * Returns data of a nature specified by its ID.
     * @param id The ID of the nature.
     * @returns Nature A nature object.
     * @throws ApiError
     */
    public static getNatureById(
        id: number,
    ): CancelablePromise<Nature> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/nature/{id}',
            path: {
                'id': id,
            },
        });
    }
}
