/**
 * Idea component
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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import Data from 'googlesitekit-data';
import Button from '../../../../../components/Button';
import { Grid, Cell, Row } from '../../../../../material-components';
import {
	STORE_NAME,
	IDEA_HUB_BUTTON_CREATE,
	IDEA_HUB_BUTTON_PIN,
	IDEA_HUB_BUTTON_UNPIN,
	IDEA_HUB_BUTTON_DELETE,
	IDEA_HUB_BUTTON_VIEW,
} from '../../../datastore/constants';
import DeleteIcon from '../../../../../../svg/idea-hub-delete.svg';
import CreateIcon from '../../../../../../svg/idea-hub-create.svg';
import PinIcon from '../../../../../../svg/idea-hub-pin.svg';
import UnpinIcon from '../../../../../../svg/idea-hub-unpin.svg';

const { useDispatch } = Data;

const Idea = ( { postEditURL, name, text, topics, buttons } ) => {
	const {
		createIdeaDraftPost,
		saveIdea,
		unsaveIdea,
	} = useDispatch( STORE_NAME );
	const [ isProcessing, setIsProcessing ] = useState( false );

	const refreshNewSavedIdeas = useCallback( async () => {
		await API.invalidateCache( 'modules', 'idea-hub', 'new-ideas' );
		await API.invalidateCache( 'modules', 'idea-hub', 'saved-ideas' );
	}, [] );

	const handleDelete = useCallback( () => {
		// @TODO: Implement callback.
		global.console.log( `Deleted: ${ name }` );
	}, [ name ] );

	const handlePin = useCallback( async () => {
		await saveIdea( name );
		await refreshNewSavedIdeas();
	}, [ refreshNewSavedIdeas, name, saveIdea ] );

	const handleUnpin = useCallback( async () => {
		await unsaveIdea( name );
		await refreshNewSavedIdeas();
	}, [ refreshNewSavedIdeas, name, unsaveIdea ] );

	const handleCreate = useCallback( async () => {
		setIsProcessing( true );
		await createIdeaDraftPost( { name, text, topics } );
		setIsProcessing( false );
	}, [ name, text, topics, createIdeaDraftPost ] );

	return (
		<Grid className="googlesitekit-idea-hub__idea--single">
			<Row>
				<Cell smSize={ 4 } mdSize={ 5 } lgSize={ 9 } className="googlesitekit-idea-hub__idea--details">
					<div className="googlesitekit-idea-hub__idea--topics">
						{ topics.map( ( topic, key ) => (
							<span className="googlesitekit-idea-hub__idea--topic" key={ key }>{ topic.display_name }</span>
						) ) }
					</div>

					<p className="googlesitekit-idea-hub__idea--text">{ text }</p>
				</Cell>
				<Cell smSize={ 4 } mdSize={ 3 } lgSize={ 3 } className="googlesitekit-idea-hub__idea--actions">
					{ buttons.includes( IDEA_HUB_BUTTON_DELETE ) && (
						<Button
							onClick={ handleDelete }
							icon={ <DeleteIcon /> }
							className="googlesitekit-idea-hub__actions--delete"
							disabled={ isProcessing }
						/>
					) }

					{ buttons.includes( IDEA_HUB_BUTTON_PIN ) && (
						<Button
							onClick={ handlePin }
							icon={ <PinIcon /> }
							className="googlesitekit-idea-hub__actions--pin"
							disabled={ isProcessing }
						/>
					) }

					{ buttons.includes( IDEA_HUB_BUTTON_UNPIN ) && (
						<Button
							onClick={ handleUnpin }
							icon={ <UnpinIcon /> }
							className="googlesitekit-idea-hub__actions--unpin"
							disabled={ isProcessing }
						/>
					) }

					{ buttons.includes( IDEA_HUB_BUTTON_CREATE ) && (
						<Button
							onClick={ handleCreate }
							icon={ <CreateIcon /> }
							disabled={ isProcessing }
						/>
					) }

					{ buttons.includes( IDEA_HUB_BUTTON_VIEW ) && postEditURL && (
						<Button href={ postEditURL } className="googlesitekit-idea-hub__actions--view">
							{ __( 'View draft', 'google-site-kit' ) }
						</Button>
					) }
				</Cell>
			</Row>
		</Grid>
	);
};

export default Idea;
