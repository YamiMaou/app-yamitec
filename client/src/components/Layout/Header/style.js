import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

const cliente = JSON.parse(localStorage.getItem("cliente"));
console.log(cliente)
const clientStyles = cliente === null ? [
  {
    primary: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)' , 
    secoundary:"#025ea2", 
    slides: [
      {
        label: 'San Francisco – Oakland Bay Bridge, United States',
        img:
          'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
      },
      {
        label: 'Bird',
        img:
          'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60',
      },
    ] }
] : JSON.parse(cliente.styles_obj);
export const themeStyle = {
  props: {
    MuiTypography: {
      variantMapping: {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        subtitle1: 'h2',
        subtitle2: 'h2',
        body1: 'span',
        body2: 'span',
      },
    },
  },
  palette: {
    primary: {
      main: "#025ea2",
      mainGradient: clientStyles[0].secoundary
      //mainGradient: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)',
    },
    secondary:{
      main: "#0086e8",
      mainGradient: clientStyles[0].primary
      //mainGradient: 'linear-gradient(45deg, #025a71 30%, #0010e8 90%)',
    },
    thirty: { // works
      main: '#69BE28',
      mainGradient: 'linear-gradient(45deg, #69BD98 30%, #69BE28 90%)',
      contrastText: '#fff',
    },
  },
}
export const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  link: {
    color: "#444",
    textDecoration: "none"
  },
  stickToTop: {
    position: 'fixed',
    top: 0,
  },
};

export const StyledAppBar = withStyles({
  root: {
    //background: 'linear-gradient(45deg, #025ea2 30%, #0086e8 90%)',
    background: clientStyles[0].primary,
    borderRadius: 3,
    borderTopLeftRadius:0,
    borderTopRightRadius: 0,
    border: 0,
    color: 'white',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(43, 56, 255, 0.3)',
  }
})(AppBar);