import React, { Component } from "react";
import { Link, NavLink } from 'react-router-dom';


class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNav: false
        }
    }

    componentDidMount = () => {

    }
    showHamburgerMenu = (status) => {
        this.setState({ showNav: status });
    }

    render() {
        return (
            <React.Fragment>
                <nav className=" navbar navbar-expand-md navbar-light fixed-top">
                    <div className="container nav-container">
                        <Link className="brand" to="/">

                            <h2 className="logo-text mb-0">JAZZY</h2>
                        </Link>



                    </div>
                </nav>

            </React.Fragment>
        );
    }
};

export default Navbar;