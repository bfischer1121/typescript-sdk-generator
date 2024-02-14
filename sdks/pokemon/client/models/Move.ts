/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Move = {
    move?: {
        /**
         * The name of the move.
         */
        name?: string;
        /**
         * The URL of the move.
         */
        url?: string;
    };
    version_group_details?: Array<{
        /**
         * The level at which the move is learned.
         */
        level_learned_at?: number;
        move_learn_method?: {
            /**
             * The name of the move learn method.
             */
            name?: string;
            /**
             * The URL of the move learn method.
             */
            url?: string;
        };
        version_group?: {
            /**
             * The name of the version group.
             */
            name?: string;
            /**
             * The URL of the version group.
             */
            url?: string;
        };
    }>;
};

