import { Action } from 'redux';
import { combineReducers } from 'redux';
import { accountReducer } from './account/account.reducer';
// import { pictureReducer } from './commerce/commerce.reducers';
import { locationReducer } from './location/location.reducer';
import { ILocation } from './location/location.model';
// import { IPicture, DEFAULT_PICTURE } from './commerce/commerce.actions';
import { pageReducer } from './main/main.reducers';
import { commandReducer, ICommand } from './shared/command.reducers';
import { DEFAULT_MALL } from './mall/mall.actions';
import { IMall } from './mall/mall.model';
import { mallReducer } from './mall/mall.reducers';
import { IDelivery, IDeliveryTime } from './delivery/delivery.model';
import { deliveryReducer } from './delivery/delivery.reducer';
import { IContact } from './contact/contact.model';
import { contactReducer } from './contact/contact.reducer';
import { restaurantReducer } from './restaurant/restaurant.reducer';
import { IRestaurant } from './restaurant/restaurant.model';
import { Account } from './account/account.model';
import { deliveryTimeReducer } from './delivery/delivery-time.reducer';

export interface IAppState {
    account: Account;
    // picture: IPicture;
    location: ILocation;
    page: string;
    cmd: ICommand;
    deliveryTime: IDeliveryTime;
    restaurant: IRestaurant;
    malls: IMall[];
    delivery: IDelivery;
    contact: IContact;
}

export const INITIAL_STATE: IAppState = {
    account: null,
    // picture: DEFAULT_PICTURE,
    location: null,
    page: 'home',
    cmd: {name: '', args: ''},
    deliveryTime: {type: '', text: ''},
    restaurant: null,
    malls: [DEFAULT_MALL],
    delivery: null,
    contact: null,
};

// export function rootReducer(last:IAppState, action:Action):IAppState{
// 	// switch (action.type){
// 	// 	case DashboardActions.SHOW_DASHBOARD:
// 	// 		return { dashboard: 'main' };
// 	// 	case DashboardActions.HIDE_DASHBOARD:
// 	// 		return { dashboard: ''};
// 	// }
// 	return last;
// }

export const rootReducer = combineReducers({
    account: accountReducer,
    // picture: pictureReducer,
    location: locationReducer,
    page: pageReducer,
    cmd: commandReducer,
    deliveryTime: deliveryTimeReducer,
    restaurant: restaurantReducer,
    malls: mallReducer,
    delivery: deliveryReducer,
    contact: contactReducer
});
