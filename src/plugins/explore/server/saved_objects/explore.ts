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

import { SavedObjectsType } from 'opensearch-dashboards/server';

export const exploreSavedObjectType: SavedObjectsType = {
  name: 'explore',
  hidden: false,
  namespaceType: 'single',
  management: {
    icon: 'discoverApp',
    defaultSearchField: 'title',
    importableAndExportable: true,
    getTitle(obj) {
      return obj.attributes.title;
    },
    getEditUrl(obj) {
      return `/management/opensearch-dashboards/objects/savedExplore/${encodeURIComponent(obj.id)}`;
    },
    getInAppUrl(obj) {
      return {
        // TODO:finalize this until flavor and view route are finalized
        path: `/app/explore/${obj.attributes.type}/#/view/${encodeURIComponent(obj.id)}`,
        uiCapabilitiesPath: 'discover.show',
      };
    },
  },
  mappings: {
    properties: {
      columns: { type: 'keyword', index: false, doc_values: false },
      description: { type: 'text' },
      hits: { type: 'integer', index: false, doc_values: false },
      kibanaSavedObjectMeta: {
        properties: {
          searchSourceJSON: { type: 'text', index: false },
        },
      },
      sort: { type: 'keyword', index: false, doc_values: false },
      title: { type: 'text' },
      version: { type: 'integer' },
      type: { type: 'text' },
      visualization: { type: 'text', index: false },
      uiState: { type: 'text', index: false },
    },
  },
};
