


const url="https://api.freeapi.app/api/v1/public/books?page=1&limit=10&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech";


const options = {method: 'GET', headers: {accept: 'application/json'}};

let currentPage=1;
let totalPages=1;
let searchQuery = "";
let bookarr = [];
let currentSort = "title"; // Default sort by title
async function fetchdata(page=1, search = "") {
    try {
        let searchUrl = `https://api.freeapi.app/api/v1/public/books?page=${page}&limit=10&inc=kind%252Cid%252Cetag%252CvolumeInfo`;

        // Check if search query is provided
        if (search) {
          searchUrl += `&query=${encodeURIComponent(search)}`;
        }
  
      // Form the API URL dynamically
   
  
        const response = await fetch(searchUrl, options);
        const data = await response.json();
        console.log(data);
         const bookarr=data.data.data;
         totalPages=data.data.totalPages;
        //display of a page
        displayBooks(bookarr);
        updatePaginationButtons()
        sortBooks("title");

      } catch (error) {
        console.error(error);
      }
}

function displayBooks(bookarr) {
    const container = document.querySelector(".card-container");
    container.innerHTML = ""; // Clear existing content before adding new cards
  
    bookarr.forEach((book) => {
        // Extract data safely from volumeInfo
        const volumeInfo = book.volumeInfo || {};
        const title = volumeInfo.title || "No Title Available";
        const subtitle = volumeInfo.subtitle || "";
        const authors = volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author";
        const publisher = volumeInfo.publisher || "Unknown Publisher";
        const publishDate = volumeInfo.publishedDate || "Unknown Date";
        const thumbnail = volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150";
    
        // Card HTML Template
        const cardHTML = `
          <div class="card">
            <img src="${thumbnail}" alt="${title}" />
            <h3>${title}</h3>
            ${subtitle ? `<p><strong>${subtitle}</strong></p>` : ""}
            <p><strong>Author(s):</strong> ${authors}</p>
            <p><strong>Publisher:</strong> ${publisher}</p>
            <p><strong>Publish Date:</strong> ${publishDate}</p>
            <button onclick="viewDetails('${title}')">View Details</button>
          </div>
        `;
        container.innerHTML += cardHTML;
      });
    
  }
// Update pagination buttons dynamically
function updatePaginationButtons() {
    const prevBtn = document.querySelector("#prevBtn");
    const nextBtn = document.querySelector("#nextBtn");
    const pageIndicator = document.querySelector("#pageIndicator");
  
    pageIndicator.innerHTML = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }
  
  // Handle Next Page
  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      fetchdata(currentPage);
    }
  }
  
  // Handle Previous Page
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      fetchdata(currentPage);
    }
  }
  
  function handleSearch() {
    const input = document.querySelector("#searchInput").value.trim();
    searchQuery = input;
  
    if (searchQuery === "") {
      alert("Please enter a search term!"); // Prevent empty search
      return;
    }
  
    // Reset to page 1 when searching
    currentPage = 1;
    fetchdata(1, searchQuery); // Fetch data with search
  }
  

  function handleSortChange(sortBy) {
    if (sortBy === "title") {
      bookarr.sort((a, b) =>
        a.volumeInfo.title.localeCompare(b.volumeInfo.title)
      );
    } else if (sortBy === "date") {
      bookarr.sort((a, b) => {
        const dateA = new Date(a.volumeInfo.publishedDate || "1900-01-01");
        const dateB = new Date(b.volumeInfo.publishedDate || "1900-01-01");
        return dateA - dateB; // Sort by oldest first
      });
    }
  
    // Clear and re-display sorted books
    document.querySelector("#booksContainer").innerHTML = "";
    displayBooks(bookarr);
  }
fetchdata();



