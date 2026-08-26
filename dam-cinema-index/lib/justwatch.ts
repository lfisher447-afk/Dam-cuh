export async function fetchJustWatchOffers(query: string) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const res = await fetch(
      "https://apis.justwatch.com/graphql",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          operationName: "GetSearchResults",

          variables: {
            country: "IN",
            language: "en",
            searchQuery: query,
            first: 4,
            location: "SearchSuggester",
          },

          query: `
            query GetSearchResults(
              $country: Country!,
              $language: Language!,
              $first: Int!,
              $searchQuery: String,
              $location: String!
            ) {
              searchTitles(
                country: $country
                first: $first
                filter: {
                  searchQuery: $searchQuery
                  includeTitlesWithoutUrl: true
                }
                source: $location
              ) {
                edges {
                  node {
                    id
                    objectId

                    content(
                      country: $country
                      language: $language
                    ) {
                      title
                      originalReleaseYear
                    }

                    offers(
                      country: $country
                      platform: WEB
                      filter: { preAffiliate: true }
                    ) {
                      monetizationType

                      package {
                        shortName
                      }
                    }
                  }
                }
              }
            }
          `,
        }),
      }
    );

    if (!res.ok) {
      console.error(
        "[JUSTWATCH_HTTP_ERROR]",
        res.status,
        res.statusText
      );

      return {
        offers: [],
        unavailable: true,
      };
    }

    const data = await res.json();

    const firstMatch =
      data?.data?.searchTitles?.edges?.[0]?.node;

    if (!firstMatch) {
      console.warn("[JUSTWATCH_EMPTY]", query);

      return {
        offers: [],
        unavailable: false,
      };
    }

    const mappedOffers = (firstMatch.offers ?? []).map(
      (offer: any) => ({
        platform: offer.package?.shortName ?? "Unknown",
        type:
          offer.monetizationType === "FLATRATE"
            ? "subscription"
            : offer.monetizationType === "RENT"
            ? "rent"
            : "buy",
      })
    );

    return {
      offers: mappedOffers,
      unavailable: false,
    };
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.error("[JUSTWATCH_TIMEOUT]", query);
    } else {
      console.error("[JUSTWATCH_ERROR]", query, err);
    }

    return {
      offers: [],
      unavailable: true,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}