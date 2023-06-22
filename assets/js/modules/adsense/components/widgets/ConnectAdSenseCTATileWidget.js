/**
 * ConnectAdSenseCTATileWidget component.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import AdSenseIcon from '../../../../../svg/graphics/adsense.svg';
import ConnectModuleCTATile from '../../../../components/KeyMetrics/ConnectModuleCTATile';
import { CORE_MODULES } from '../../../../googlesitekit/modules/datastore/constants';
import {
	CORE_USER,
	KM_ANALYTICS_ADSENSE_TOP_EARNING_CONTENT,
} from '../../../../googlesitekit/datastore/user/constants';

const { useSelect } = Data;

export default function ConnectAdSenseCTATileWidget( { Widget, WidgetNull } ) {
	const isAdSenseModuleConnected = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleConnected( 'adsense' )
	);

	const keyMetrics = useSelect( ( select ) => {
		if ( isAdSenseModuleConnected !== false ) {
			return;
		}
		return select( CORE_USER ).getKeyMetrics();
	} );

	if (
		isAdSenseModuleConnected === false &&
		keyMetrics.includes( KM_ANALYTICS_ADSENSE_TOP_EARNING_CONTENT )
	) {
		return (
			<ConnectModuleCTATile
				Icon={ AdSenseIcon }
				moduleSlug="adsense"
				Widget={ Widget }
			/>
		);
	}

	return <WidgetNull />;
}

ConnectAdSenseCTATileWidget.propTypes = {
	Widget: PropTypes.elementType.isRequired,
	WidgetNull: PropTypes.elementType.isRequired,
};
