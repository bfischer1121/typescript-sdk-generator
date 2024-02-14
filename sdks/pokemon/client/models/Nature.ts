/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Nature = {
    /**
     * The ID of the nature.
     */
    id?: number;
    /**
     * The name of the nature.
     */
    name?: string;
    increased_stat?: {
        /**
         * The name of the stat increased by this nature.
         */
        name?: string;
        /**
         * The URL of the stat increased by this nature.
         */
        url?: string;
    };
    decreased_stat?: {
        /**
         * The name of the stat decreased by this nature.
         */
        name?: string;
        /**
         * The URL of the stat decreased by this nature.
         */
        url?: string;
    };
    likes_flavor?: {
        /**
         * The flavor this nature likes.
         */
        name?: string;
        /**
         * The URL of the flavor this nature likes.
         */
        url?: string;
    };
    hates_flavor?: {
        /**
         * The flavor this nature hates.
         */
        name?: string;
        /**
         * The URL of the flavor this nature hates.
         */
        url?: string;
    };
};

