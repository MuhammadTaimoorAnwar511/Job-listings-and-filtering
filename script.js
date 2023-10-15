$(document).ready(function () 
{
    // Load data from "data.json" using AJAX
    $.getJSON("data.json", function (data) {
        const jobList = $("#job-list");

        // Event listener for the "Clear" button
        $("#clear-button").click(function () {
            // Clear the search input field
            $("#search-input").val("");

            // Filter job listings to show all listings again
            filterJobListings();
        });

        // Event delegation for the "Delete" button
        jobList.on("click", ".delete-button", function () {
             // Find the closest parent element with the class "job-div" and remove it from the DOM
            $(this).closest('.job-div').remove();
        });

        // Click event handler for language and tool boxes
        jobList.on("click", ".colored-box.small-box", function () 
        {
            const clickedText = $(this).text();
            const currentSearchText = $("#search-input").val();

            const searchtext = currentSearchText ? currentSearchText + " " + clickedText : clickedText;
            // Check if the clicked box has the "new-box" or "featured-box" class and prevent the action
            if ($(this).hasClass('new-box') || $(this).hasClass('featured-box')) {
                return; // Prevent further action
            } 
            else 
            {
                // Update the input field with the new text
                $("#search-input").val(searchtext);
                // Filter job listings based on the selected language and tool
                filterJobListings();
            }
        });

        // Click event handler for the text in the search input
        $("#search-input").on("click", function (e) 
        {
            // Check if you clicked on a text within the input field
            if (e.target === this) {
                const currentValue = $(this).val();
                const elementsToRemove = ["HTML", "CSS", "JavaScript", "Python", "React", "Saas", "Ruby", "RoR", "Vue", "Django", "C++"];

                for (const element of elementsToRemove) 
                {
                    // Check if the clicked element is present in the input field
                    if (currentValue.includes(element)) 
                    {
                        // Replace the element and trim extra white spaces
                        const newValue = currentValue.replace(element, "").replace(/\s+/g, ' ').trim();
                        $(this).val(newValue);

                        filterJobListings(); // Reload job listings dynamically
                        break; // Exit the loop after the first match is found
                    }
                }
            }
        });

        // Show the popup when the "Add" button is clicked
        $("#add-button").click(function () {
            $("#popup-overlay").fadeIn();
        });

        // Close the popup when the "Close" button is clicked
        $("#close-popup").click(function () {
            $("#popup-overlay").fadeOut();
        });

        // Handle form submission to add a new job
        $("#submit-new-job").click(function (e) {
            e.preventDefault();

            // Get values from form fields
            const company = $("#new-job-company").val();
            const position = $("#new-job-position").val();
            const logo = $("#new-job-logo").val();
            const isNew = $("#new-job-new").is(":checked");
            const isFeatured = $("#new-job-featured").is(":checked");
            const role = $("#new-job-role").val();
            const level = $("#new-job-level").val();
            const postedAt = "Now";
            const contract = $("#new-job-contract").val();
            const location = $("#new-job-location").val();
            const languages = $("#new-job-languages").val().split(',').map(lang => lang.trim());
            const tools = $("#new-job-tools").val().split(',').map(tool => tool.trim());

            // Validate all fields
            if (!company || !position || !logo || !role || !level || !postedAt || !contract || !location || languages.length === 0 || tools.length == 0) {
                // Handle validation error, some fields are empty
                alert("Please fill in all required fields.");
                return;
            }

            // Validate the logo path format
            if (logo !== "./images/photosnap.svg") {
                // Handle validation error, invalid logo path
                alert("Please provide a correct logo path in the format './images/....");
                return;
            }

            // Continue with job creation if all validations passed

            const newJob = {
                company: company,
                position: position,
                logo: logo,
                new: isNew,
                featured: isFeatured,
                role: role,
                level: level,
                postedAt: postedAt,
                contract: contract,
                location: location,
                languages: languages,
                tools: tools
            };

            // Determine the values for Column 2 and Row 1
            if (newJob.new && newJob.featured) {
                newJob.column2 = "New and Featured";
                newJob.row1 = "New and Featured";
            } else if (newJob.new) {
                newJob.column2 = "New";
                newJob.row1 = "New";
            } else if (newJob.featured) {
                newJob.column2 = "Featured";
                newJob.row1 = "Featured";
            } else {
                newJob.column2 = ""; // Set to an empty string if neither "New" nor "Featured" is checked
                newJob.row1 = "";   // Set to an empty string if neither "New" nor "Featured" is checked
            }

            // Create a job listing and append it to the job list
            const jobDiv = createJobListing(newJob);
            $("#job-list").append(jobDiv);

            // Clear form fields and close the popup
            $("#new-job-form")[0].reset();
            $("#popup-overlay").fadeOut();
        });

        function addNewJob() {
            const newJob = {
                company: " Company",
                logo: "./images/photosnap.svg",
                position: "New Position",
                postedAt: "2 days ago",
                contract: "Full Time",
                location: "New York, NY",
                languages: ["JavaScript", "HTML"],
                tools: ["jQuery"],
            };

            // Create a job listing HTML element for the new job
            const jobDiv = createJobListing(newJob);

            // Append the jobDiv to the job list container
            jobList.append(jobDiv);

            // Clear the search input and filter the job listings
            $("#search-input").val("");
            filterJobListings();
        }

        // Function to filter job listings based on search input
        function filterJobListings() {
            const searchInput = $("#search-input").val().toLowerCase();
            jobList.find('.job-div').each(function () {
                const jobDiv = $(this);
                const languagesTools = jobDiv.find('.languages-tools .small-box').map(function () {
                    return $(this).text().toLowerCase();
                }).get().join(' ');
                if (languagesTools.includes(searchInput)) {
                    jobDiv.show();
                } else {
                    jobDiv.hide();
                }
            });
        }

        function createJobListing(job) {
            // Create the job listing HTML elements using jQuery
            const jobDiv = $('<div>').addClass('job-div');
            jobDiv.append(
                $('<div>').addClass('job-column').attr('id', 'column-1').append(
                    $('<img>').addClass('company-logo').attr('src', job.logo).attr('alt', 'Company Logo')
                ),

                $('<div>').addClass('job-column').attr('id', 'column-2').append(
                    $('<div>').addClass('company-name').text(job.company),
                    $('<div>').addClass('position').text(job.position),
                    $('<div>').addClass('row row-3').append(
                        $('<div>').addClass('posted-at').text(job.postedAt),
                        $('<div>').addClass('contract').text(job.contract),
                        $('<div>').addClass('location').text(job.location)
                    )
                ),

                $('<div>').addClass('job-column-3').attr('id', 'column-3').append(
                    $('<div>').addClass('languages-tools').append(
                        $.map(job.languages, function (lang) {
                            return $('<span>').addClass('colored-box small-box').text(lang);
                        }),
                        $.map(job.tools, function (tool) {
                            return $('<span>').addClass('colored-box small-box').text(tool);
                        }),
                        $('<button>').addClass('delete-button').text('Delete')
                    )
                )
            );
            return jobDiv;
        }

        // Iterate over the data and create job listings
        $.each(data, function (index, job) {
            // Determine the classes for "New" and "Featured" boxes
            let newBoxClass = job.new ? 'new-box' : '';
            let featuredBoxClass = job.featured ? 'featured-box' : '';

            // Create the "New" colored-box element
            const newBox = newBoxClass ? $('<span>').addClass('colored-box small-box ' + newBoxClass).text('NEW!') : '';

            // Create the "Featured" colored-box element
            const featuredBox = featuredBoxClass ? $('<span>').addClass('colored-box small-box featured-box featured-box:hover ' + featuredBoxClass).text('FEATURE') : '';

            // Add a space between "NEW!" and "FEATURE" if both conditions are met
            const space = (newBoxClass && featuredBoxClass) ? ' ' : '';

            // Create the delete button with the "delete-button" class
            const deleteButton = $('<button>').addClass('delete-button').text('Delete');

            // Create job listing HTML elements using jQuery
            const jobDiv = $('<div>').addClass('job-div');
            jobDiv.append(
                $('<div>').addClass('job-column').attr('id', 'column-1').append(
                    $('<img>').addClass('company-logo').attr('src', job.logo).attr('alt', 'Company Logo')
                ),

                $('<div>').addClass('job-column').attr('id', 'column-2').append(
                    $('<div>').addClass('row company-name').text(job.company).append(newBox, space, featuredBox),

                    $('<div>').addClass('row position position-2').text(job.position),

                    $('<div>').addClass('row row-3').append(
                        $('<div>').addClass('column posted-at posted-at-2').text(job.postedAt),

                        $('<div>').addClass('column contract contract-2').text(job.contract),

                        $('<div>').addClass('column location location-2').text(job.location)
                    )
                ),

                $('<div>').addClass('job-column job-column-3').attr('id', 'column-3').append(
                    $('<div>').addClass('row languages-tools').append(
                        $.map(job.languages, function (lang) {
                            return $('<span>').addClass('colored-box small-box').text(lang);
                        }),
                        $.map(job.tools, function (tool) {
                            return $('<span>').addClass('colored-box small-box').text(tool);
                        }),
                        deleteButton
                    )
                )
            );

            // Append the jobDiv to the job list container
            jobList.append(jobDiv);
        });
    }).fail(function (error) {
        console.error("Error loading data: " + error.statusText);
    });
});
