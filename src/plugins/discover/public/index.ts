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

import { PluginInitializerContext } from 'opensearch-dashboards/public';
import { DiscoverPlugin } from './plugin';

export { DiscoverSetup, DiscoverStart } from './plugin';
export function plugin(initializerContext: PluginInitializerContext) {
  return new DiscoverPlugin(initializerContext);
}

export { SavedSearch, SavedSearchLoader, createSavedSearchesLoader } from './saved_searches';

export { ISearchEmbeddable, SEARCH_EMBEDDABLE_TYPE, SearchInput } from './embeddable';
export { DISCOVER_APP_URL_GENERATOR, DiscoverUrlGeneratorState } from './url_generator';
export { SearchData, ResultStatus } from './application/view_components';

export {
  indexPatternMock,
  indexPatternFieldMock,
  indexPatternInitialMock,
  getMockedIndexPatternWithCustomizedFields,
  getMockedIndexPatternWithTimeField,
} from './__mock__/index_pattern_mock';
