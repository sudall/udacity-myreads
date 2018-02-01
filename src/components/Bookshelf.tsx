import * as React from "react";
import BookshelfData from "src/data/models/BookshelfData";
import Book from "src/components/Book";
import CustomComponentValidators from "src/CustomComponentValidators";
import {ReactNode} from "react";

class Bookshelf extends React.Component<Bookshelf.IProps> {
    private mapChildrenToListItems() {
        return React.Children.map<ReactNode>(this.props.children, (child) => {
            return (
                <li>
                    {child}
                </li>
            );
        });
    }

    public static calculateBookshelfDisplayTitle(shelfTitle: string) {
        let result = shelfTitle.replace(/([A-Z])/g, " $1");

        result = `${result.charAt(0).toUpperCase()}${result.slice(1)}`;

        return result;
    }

    render() {
        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{Bookshelf.calculateBookshelfDisplayTitle(this.props.bookshelf.title)}</h2>
                <div className="bookshelf-books">
                    <ol className="books-grid">
                        {this.mapChildrenToListItems()}
                    </ol>
                </div>
            </div>
        )
    }
}

module Bookshelf {
    export interface IProps {
        bookshelf: BookshelfData;
    }
}

Bookshelf["propTypes"] = {
    children: CustomComponentValidators.createChildrenTypesValidator([Book])
};

export default Bookshelf;