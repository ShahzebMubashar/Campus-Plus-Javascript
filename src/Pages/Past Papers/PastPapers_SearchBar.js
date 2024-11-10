const SearchBar = ({ onSearch }) => (
    <div className="search-bar">
        <input type="text" placeholder="Search courses..." onChange={onSearch} />
    </div>
);

export default SearchBar;