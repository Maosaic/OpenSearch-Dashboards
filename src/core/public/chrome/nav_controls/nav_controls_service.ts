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

import { sortBy } from 'lodash';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MountPoint } from '../../types';

/** @public */
export interface ChromeNavControl {
  order?: number;
  mount: MountPoint;
}

/**
 * {@link ChromeNavControls | APIs} for registering new controls to be displayed in the navigation bar.
 *
 * @example
 * Register a left-side nav control rendered with React.
 * ```jsx
 * chrome.navControls.registerLeft({
 *   mount(targetDomElement) {
 *     ReactDOM.mount(<MyControl />, targetDomElement);
 *     return () => ReactDOM.unmountComponentAtNode(targetDomElement);
 *   }
 * })
 * ```
 *
 * @public
 */
export interface ChromeNavControls {
  /** Register a nav control to be presented on the bottom-left side of the chrome header. */
  registerLeft(navControl: ChromeNavControl): void;
  /** Register a nav control to be presented on the top-right side of the chrome header. */
  registerRight(navControl: ChromeNavControl): void;
  /** Register a nav control to be presented on the top-center side of the chrome header. */
  registerCenter(navControl: ChromeNavControl): void;
  /** Register a nav control to be presented on the left-bottom side of the left navigation. */
  registerLeftBottom(navControl: ChromeNavControl): void;
  /** Register a nav control to be presented on the right side of the primary chrome header. */
  registerPrimaryHeaderRight(navControl: ChromeNavControl): void;
  /** @internal */
  getLeft$(): Observable<ChromeNavControl[]>;
  /** @internal */
  getRight$(): Observable<ChromeNavControl[]>;
  /** @internal */
  getCenter$(): Observable<ChromeNavControl[]>;
  /** @internal */
  getLeftBottom$(): Observable<ChromeNavControl[]>;
  /** @internal */
  getPrimaryHeaderRight$(): Observable<ChromeNavControl[]>;
}

/** @internal */
export class NavControlsService {
  private readonly stop$ = new ReplaySubject(1);

  public start() {
    const navControlsLeft$ = new BehaviorSubject<ReadonlySet<ChromeNavControl>>(new Set());
    const navControlsRight$ = new BehaviorSubject<ReadonlySet<ChromeNavControl>>(new Set());
    const navControlsCenter$ = new BehaviorSubject<ReadonlySet<ChromeNavControl>>(new Set());
    const navControlsExpandedRight$ = new BehaviorSubject<ReadonlySet<ChromeNavControl>>(new Set());
    const navControlsExpandedCenter$ = new BehaviorSubject<ReadonlySet<ChromeNavControl>>(
      new Set()
    );
    const navControlsLeftBottom$ = new BehaviorSubject<ReadonlySet<ChromeNavControl>>(new Set());
    const navControlsPrimaryHeaderRight$ = new BehaviorSubject<ReadonlySet<ChromeNavControl>>(
      new Set()
    );

    return {
      // In the future, registration should be moved to the setup phase. This
      // is not possible until the legacy nav controls are no longer supported.
      registerLeft: (navControl: ChromeNavControl) =>
        navControlsLeft$.next(new Set([...navControlsLeft$.value.values(), navControl])),

      registerRight: (navControl: ChromeNavControl) =>
        navControlsRight$.next(new Set([...navControlsRight$.value.values(), navControl])),

      registerCenter: (navControl: ChromeNavControl) =>
        navControlsCenter$.next(new Set([...navControlsCenter$.value.values(), navControl])),

      registerExpandedRight: (navControl: ChromeNavControl) =>
        navControlsExpandedRight$.next(
          new Set([...navControlsExpandedRight$.value.values(), navControl])
        ),

      registerExpandedCenter: (navControl: ChromeNavControl) =>
        navControlsExpandedCenter$.next(
          new Set([...navControlsExpandedCenter$.value.values(), navControl])
        ),

      registerLeftBottom: (navControl: ChromeNavControl) =>
        navControlsLeftBottom$.next(
          new Set([...navControlsLeftBottom$.value.values(), navControl])
        ),

      registerPrimaryHeaderRight: (navControl: ChromeNavControl) =>
        navControlsPrimaryHeaderRight$.next(
          new Set([...navControlsPrimaryHeaderRight$.value.values(), navControl])
        ),

      getLeft$: () =>
        navControlsLeft$.pipe(
          map((controls) => sortBy([...controls.values()], 'order')),
          takeUntil(this.stop$)
        ),
      getRight$: () =>
        navControlsRight$.pipe(
          map((controls) => sortBy([...controls.values()], 'order')),
          takeUntil(this.stop$)
        ),
      getCenter$: () =>
        navControlsCenter$.pipe(
          map((controls) => sortBy([...controls.values()], 'order')),
          takeUntil(this.stop$)
        ),
      getExpandedRight$: () =>
        navControlsExpandedRight$.pipe(
          map((controls) => sortBy([...controls.values()], 'order')),
          takeUntil(this.stop$)
        ),
      getExpandedCenter$: () =>
        navControlsExpandedCenter$.pipe(
          map((controls) => sortBy([...controls.values()], 'order')),
          takeUntil(this.stop$)
        ),
      getLeftBottom$: () =>
        navControlsLeftBottom$.pipe(
          map((controls) => sortBy([...controls.values()], 'order')),
          takeUntil(this.stop$)
        ),
      getPrimaryHeaderRight$: () =>
        navControlsPrimaryHeaderRight$.pipe(
          map((controls) => sortBy([...controls.values()], 'order')),
          takeUntil(this.stop$)
        ),
    };
  }

  public stop() {
    this.stop$.next();
  }
}
