package dev.ongolebulls.bse.common.parser;

/**
 * Interface for parsing BSE API responses.
 * Each BSE API integration provides its own implementation
 * since response formats differ across APIs.
 *
 * @param <T> the typed response object returned after parsing
 */
public interface BseResponseParser<T> {

    /**
     * Parse a raw BSE response string into a typed response object.
     */
    T parse(String rawResponse, int httpStatus);

    /**
     * Quick check if the raw response indicates success.
     */
    boolean isSuccess(String rawResponse);
}
