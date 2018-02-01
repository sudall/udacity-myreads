import "src/App.css";
import * as React from "react";
import BookData from "src/data/models/BookData";
import BookshelfData from "src/data/models/BookshelfData";
import SearchPage from "src/components/SearchPage";
import BookshelfPage from "src/components/BookshelfPage"
import BookConnector from "src/data/connectors/BookConnector";
import {Route} from "react-router";
import {History} from "history";

class BooksApp extends React.Component {
    state = new BooksApp.State();

    static readonly BookshelfTitlesToDisplay: string[] = ["currentlyReading", "wantToRead", "read"];
    static readonly NoneBookshelfTitle = "none";

    private buildBookshelves(books: BookData[]): BookshelfData[] {
        let bookshelfTitleToBookshelfMap = new Map<string, BookshelfData>();

        books.forEach((book) => {
            let shelfTitle = book.shelf || "unknown";

            let shelfData = bookshelfTitleToBookshelfMap.get(shelfTitle);
            if (shelfData == null) {
                shelfData = new BookshelfData();
                shelfData.title = shelfTitle;
                bookshelfTitleToBookshelfMap.set(shelfTitle, shelfData);
            }

            shelfData.books.push(book);
        });

        // get the known bookshelves that we want to display
        let bookshelves = BooksApp.BookshelfTitlesToDisplay.map((title) => {
            let bookshelf = bookshelfTitleToBookshelfMap.get(title);

            if (bookshelf == null) {
                bookshelf = new BookshelfData();
                bookshelf.title = title;
            }

            return bookshelf;
        });

        // sort by the known order
        bookshelves.sort((item1, item2) => {
            let item1Index = BooksApp.BookshelfTitlesToDisplay.indexOf(item1.title);
            let item2Index = BooksApp.BookshelfTitlesToDisplay.indexOf(item2.title);
            return item1Index - item2Index;
        });

        return bookshelves;
    }

    private updateBook(book: BookData, bookshelfTitle: string) {
        BookConnector.updateBook(book, bookshelfTitle)
            .subscribe(() => {
                this.setState((previousState: BooksApp.State) => {
                    book.shelf = bookshelfTitle;

                    return {
                        books: previousState.books
                    };
                })
            });
    }

    componentDidMount() {
        BookConnector.getAllBooks()
            .subscribe((books) => {
                this.setState({
                    books: books,
                });
            });
    }

    private static onSearchPageClose(history: History) {
        history.push(BookshelfPage.getRoutePath());
    }

    render() {
        return (
            <div className="app">
                <Route path={BookshelfPage.getRoutePath()} exact render={
                    (props) => {
                        return <BookshelfPage bookshelves={this.buildBookshelves(this.state.books)}
                                              onUpdateBook={this.updateBook.bind(this)}
                                              {...props} />
                    }
                }/>
                <Route path={SearchPage.getRoutePath()} render={
                    ({history}) => {
                        return <SearchPage onClose={() => { BooksApp.onSearchPageClose(history); }} />
                    }
                }/>
            </div>
        );
    }
}

module BooksApp {
    export class State {
        books: BookData[] = [];
    }
}

export default BooksApp;
