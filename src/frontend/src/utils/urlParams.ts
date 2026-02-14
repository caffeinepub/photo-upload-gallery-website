/**
 * Utility functions for reading and manipulating URL hash parameters.
 * Supports both standard hash routing (#/path) and hash-fragment parameters (#key=value).
 */

/**
 * Parse hash-fragment parameters in the format #key=value or #key1=value1&key2=value2
 * This is separate from hash routing (e.g., #/path)
 */
export function getHashParam(key: string): string | null {
  const hash = window.location.hash;
  
  // Remove leading # if present
  const hashContent = hash.startsWith('#') ? hash.slice(1) : hash;
  
  // Skip if it looks like a route (starts with /)
  if (hashContent.startsWith('/')) {
    return null;
  }
  
  // Parse key=value pairs
  const params = new URLSearchParams(hashContent);
  return params.get(key);
}

/**
 * Set a hash parameter without affecting the rest of the URL
 */
export function setHashParam(key: string, value: string): void {
  const hash = window.location.hash;
  const hashContent = hash.startsWith('#') ? hash.slice(1) : hash;
  
  // If it's a route, don't modify
  if (hashContent.startsWith('/')) {
    return;
  }
  
  const params = new URLSearchParams(hashContent);
  params.set(key, value);
  window.location.hash = params.toString();
}

/**
 * Remove a hash parameter, preserving other parameters
 */
export function removeHashParam(key: string): void {
  const hash = window.location.hash;
  const hashContent = hash.startsWith('#') ? hash.slice(1) : hash;
  
  // If it's a route, don't modify
  if (hashContent.startsWith('/')) {
    return;
  }
  
  const params = new URLSearchParams(hashContent);
  params.delete(key);
  
  // Update hash or clear it if no params remain
  const newHash = params.toString();
  if (newHash) {
    window.location.hash = newHash;
  } else {
    // Clear hash entirely
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

/**
 * Clear all hash parameters
 */
export function clearHashParams(): void {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}

/**
 * Get a secret parameter from URL query string or sessionStorage.
 * Used for sensitive parameters like admin tokens that should be passed once
 * and then stored in sessionStorage for subsequent use.
 * 
 * @param key - The parameter key to retrieve
 * @returns The parameter value or null if not found
 */
export function getSecretParameter(key: string): string | null {
  // First check sessionStorage
  try {
    const stored = sessionStorage.getItem(key);
    if (stored) {
      return stored;
    }
  } catch (e) {
    // SessionStorage might not be available in some contexts
    console.warn('SessionStorage not available:', e);
  }

  // Then check URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(key);
  
  // If found in URL, store it in sessionStorage and remove from URL
  if (value) {
    try {
      sessionStorage.setItem(key, value);
      
      // Remove the parameter from URL to avoid exposing it
      urlParams.delete(key);
      const newSearch = urlParams.toString();
      const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
      history.replaceState(null, '', newUrl);
    } catch (e) {
      console.warn('Failed to store parameter in sessionStorage:', e);
    }
    
    return value;
  }
  
  return null;
}
