
export const initialState = JSON.parse(localStorage.getItem('user'));
export const reducer = (state, action) => {
    if (action.type == 'USER') {
        return action.payload
    } 
    if(action.type == 'CLEAR'){
        return null;
    }if(action.type == "UPDATE"){
        const {following} = action.payload;
        const {followers} = action.payload;
        return {
            ...state,
            followers,
            following
        }
    }if(action.type == 'UPDATEDP'){
        return{
            ...state,
            dp:action.payload
        }
    }
    return state;
}