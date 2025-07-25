/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useCallback } from 'react';
import { SurrDocType } from './context/api/context';
import { ActionBar } from './context/components/action_bar/action_bar';
import { CONTEXT_STEP_SETTING } from '../../../../../../../common/legacy/discover';
import { ExploreServices } from '../../../../../../types';
import { useOpenSearchDashboards } from '../../../../../../../../opensearch_dashboards_react/public';
import { LOADING_STATUS } from './context/utils/context_query_state';
import { SortDirection } from '../../../../../../../../data/public';
import { DataGridTable } from '../data_grid/data_grid_table';
import { DocViewFilterFn } from '../../doc_views/doc_views_types';
import { IndexPattern } from '../../../opensearch_dashboards_services';
import { AppState } from './context/utils/context_state';
import { SortOrder } from '../../../../../../types/saved_explore_types';

export interface Props {
  onAddFilter: DocViewFilterFn;
  rows: any[];
  indexPattern: IndexPattern;
  setAppState: (state: Partial<AppState>) => void;
  onAddColumn?: (col: string) => void;
  onRemoveColumn?: (col: string) => void;
  onSetColumns?: (cols: string[]) => void;
  onSetSort?: (s: Array<[string, string]>) => void;
  contextQueryState: any;
  appState: AppState;
}

export function ContextApp({
  onAddFilter,
  rows,
  indexPattern,
  setAppState,
  contextQueryState,
  appState,
}: Props) {
  const { services } = useOpenSearchDashboards<ExploreServices>();
  const { uiSettings } = services;
  const defaultStepSize = useMemo(() => parseInt(uiSettings.get(CONTEXT_STEP_SETTING), 10), [
    uiSettings,
  ]);
  const { columns, predecessorCount, successorCount } = appState;
  const {
    anchorStatus,
    predecessorsStatus,
    successorsStatus,
    predecessors,
    successors,
  } = contextQueryState;
  const isAnchorLoading =
    anchorStatus.value === LOADING_STATUS.LOADING ||
    anchorStatus.value === LOADING_STATUS.UNINITIALIZED;
  const isPredecessorLoading =
    predecessorsStatus.value === LOADING_STATUS.LOADING ||
    predecessorsStatus.value === LOADING_STATUS.UNINITIALIZED;
  const isSuccessorLoading =
    successorsStatus.value === LOADING_STATUS.LOADING ||
    successorsStatus.value === LOADING_STATUS.UNINITIALIZED;

  const onChangeCount = useCallback(
    (type: SurrDocType, count: number) => {
      const countType = type === SurrDocType.SUCCESSORS ? 'successorCount' : 'predecessorCount';
      if (countType === 'successorCount') {
        setAppState({ successorCount: count });
      } else {
        setAppState({ predecessorCount: count });
      }
    },
    [setAppState]
  );

  const sort: SortOrder[] = useMemo(() => {
    return [[indexPattern.timeFieldName!, SortDirection.desc]];
  }, [indexPattern]);

  return (
    <>
      <ActionBar
        defaultStepSize={defaultStepSize}
        docCount={predecessorCount}
        docCountAvailable={predecessors.length}
        isDisabled={isAnchorLoading}
        isLoading={isPredecessorLoading}
        onChangeCount={onChangeCount}
        type={SurrDocType.PREDECESSORS}
      />
      <div className="dscDocsGrid" data-test-subj="dscDocsGrid">
        <DataGridTable
          aria-label={'ContextTable'}
          columns={columns}
          indexPattern={indexPattern}
          onAddColumn={() => {}}
          onFilter={onAddFilter}
          onMoveColumn={() => {}}
          onRemoveColumn={() => {}}
          onSort={() => {}}
          sort={sort}
          rows={rows}
        />
      </div>
      <ActionBar
        defaultStepSize={defaultStepSize}
        docCount={successorCount}
        docCountAvailable={successors.length}
        isDisabled={isAnchorLoading}
        isLoading={isSuccessorLoading}
        onChangeCount={onChangeCount}
        type={SurrDocType.SUCCESSORS}
      />
    </>
  );
}
