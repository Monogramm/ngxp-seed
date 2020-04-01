
/**
 * Parameter Types.
 */
export enum ParameterType {
    /**
     * An URL parameter.
     */
    URL,
    /**
     * A Path parameter.
     */
    PATH,
    /**
     * A color parameter.
     */
    COLOR,
    /**
     * A Date and Time parameter.
     */
    DATE_TIME,
    /**
     * A Time parameter.
     */
    TIME,
    /**
     * A Date parameter.
     */
    DATE,
    /**
     * A double parameter.
     */
    DOUBLE,
    /**
     * An integer parameter.
     */
    INTEGER,
    /**
     * An integer parameter.
     */
    BOOLEAN,
    /**
     * A String parameter.
     */
    STRING,
    /**
     * A parameter whose value can be anything.
     *
     * Often used for JSON serialization of objects.
     */
    ANY
}
