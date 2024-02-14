/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ability } from './Ability';
import type { Form } from './Form';
import type { GameIndex } from './GameIndex';
import type { Move } from './Move';
import type { Stat } from './Stat';
import type { Type } from './Type';
export type Pokemon = {
    /**
     * The identifier for this Pokémon resource.
     */
    id?: number;
    /**
     * The name of this Pokémon.
     */
    name?: string;
    /**
     * The base experience gained for defeating this Pokémon.
     */
    base_experience?: number;
    /**
     * The height of this Pokémon in decimeters.
     */
    height?: number;
    /**
     * Set for exactly one Pokémon used as the default for each species.
     */
    is_default?: boolean;
    /**
     * Order for sorting. Almost national order, except families are grouped together.
     */
    order?: number;
    /**
     * The weight of this Pokémon in hectograms.
     */
    weight?: number;
    abilities?: Array<Ability>;
    forms?: Array<Form>;
    game_indices?: Array<GameIndex>;
    held_items?: Array<Record<string, any>>;
    /**
     * A link to a list of locations where this Pokémon can be encountered.
     */
    location_area_encounters?: string;
    moves?: Array<Move>;
    species?: {
        /**
         * The name of this Pokémon species.
         */
        name?: string;
        /**
         * The URL of this Pokémon species.
         */
        url?: string;
    };
    sprites?: {
        /**
         * The default back sprite for this Pokémon.
         */
        back_default?: string;
        /**
         * The default front sprite for this Pokémon.
         */
        front_default?: string;
    };
    stats?: Array<Stat>;
    types?: Array<Type>;
};

