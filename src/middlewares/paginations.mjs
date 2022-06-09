//!pagination
export async function paginate(array, page_limit, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return (await array).slice(
      (page_number - 1) * page_limit,
      page_number * page_limit
    );
  }
  