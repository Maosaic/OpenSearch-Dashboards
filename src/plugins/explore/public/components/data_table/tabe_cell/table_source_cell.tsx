/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import './table_source_cell.scss';

import React, { Fragment } from 'react';
import dompurify from 'dompurify';

import {
  EuiDescriptionList,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
} from '@elastic/eui';
import { stringify } from '@osd/std';
import { IndexPattern } from 'src/plugins/data/public';
import { shortenDottedString } from 'src/plugins/explore/public/helpers/shorten_dotted_string';

export interface ITableSourceCellProps {
  idxPattern: IndexPattern;
  row: Record<string, unknown>;
  columnId: string;
  isDetails: boolean;
  isShortDots: boolean;
}

export const TableSourceCell = ({
  idxPattern,
  row,
  columnId,
  isDetails,
  isShortDots,
}: ITableSourceCellProps) => {
  if (isDetails) {
    return <span>{stringify(row[columnId], null, 2)}</span>;
  }
  const formattedRow = idxPattern.formatHit(row);
  const rawKeys = Object.keys(formattedRow);
  const keys = isShortDots ? rawKeys.map((k) => shortenDottedString(k)) : rawKeys;

  return (
    <EuiDescriptionList type="inline" compressed className="source">
      {keys.map((key, index) => (
        <Fragment key={key}>
          <EuiDescriptionListTitle
            className="osdDescriptionListFieldTitle"
            data-test-subj="dscDataGridTableCellListFieldTitle"
          >
            {key + ':'}
          </EuiDescriptionListTitle>
          <EuiDescriptionListDescription
            dangerouslySetInnerHTML={{ __html: dompurify.sanitize(formattedRow[key]) }}
          />
          {index !== keys.length - 1 && ' '}
        </Fragment>
      ))}
    </EuiDescriptionList>
  );
};
