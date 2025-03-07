/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { SearchResponse } from 'elasticsearch';
import { FetchHandlers, SearchRequest } from '../fetch';
import { defaultSearchStrategy } from './default_search_strategy';
import { ISearchOptions } from '../../index';

export function callClient(
  searchRequests: SearchRequest[],
  requestsOptions: ISearchOptions[] = [],
  fetchHandlers: FetchHandlers,
  dataSourceId?: string
) {
  // Correlate the options with the request that they're associated with
  const requestOptionEntries: Array<[
    SearchRequest,
    ISearchOptions
  ]> = searchRequests.map((request, i) => [request, requestsOptions[i]]);
  const requestOptionsMap = new Map<SearchRequest, ISearchOptions>(requestOptionEntries);
  const requestResponseMap = new Map<SearchRequest, Promise<SearchResponse<any>>>();

  const { searching, abort } = defaultSearchStrategy.search({
    searchRequests,
    dataSourceId,
    ...fetchHandlers,
  });

  searchRequests.forEach((request, i) => {
    const response = searching.then((results) => fetchHandlers.onResponse(request, results[i]));
    const { abortSignal = null } = requestOptionsMap.get(request) || {};
    if (abortSignal) abortSignal.addEventListener('abort', abort);
    requestResponseMap.set(request, response);
  });
  return searchRequests.map((request) => requestResponseMap.get(request)!);
}
