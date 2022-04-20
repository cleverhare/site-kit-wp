/**
 * Tag Manager Use Snippet Switch component.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
import classNames from 'classnames';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { MODULES_TAGMANAGER } from '../../datastore/constants';
import Switch from '../../../../components/Switch';
const { useSelect, useDispatch } = Data;

export default function UseSnippetSwitch( { description = [], isSetup } ) {
	const useSnippet = useSelect( ( select ) =>
		select( MODULES_TAGMANAGER ).getUseSnippet()
	);

	const { setUseSnippet } = useDispatch( MODULES_TAGMANAGER );
	const onChange = useCallback( () => {
		setUseSnippet( ! useSnippet );
	}, [ useSnippet, setUseSnippet ] );

	if ( useSnippet === undefined ) {
		return null;
	}

	return (
		<div
			className={ classNames( 'googlesitekit-tagmanager-usesnippet', {
				'googlesitekit-tagmanager-usesnippet--setup': isSetup,
			} ) }
		>
			<Switch
				label={ __(
					'Let Site Kit place code on your site',
					'google-site-kit'
				) }
				checked={ useSnippet }
				onClick={ onChange }
				hideLabel={ false }
			/>
			{ description.map( ( line ) => (
				<p key={ line }>
					<span>{ line }</span>
				</p>
			) ) }
		</div>
	);
}

UseSnippetSwitch.propTypes = {
	description: PropTypes.arrayOf( PropTypes.string ),
	isSetup: PropTypes.bool,
};
