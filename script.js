function convertToText() {
    var fileInput = document.getElementById('pdfFileInput');
    var file = fileInput.files[0];

    var reader = new FileReader();
    reader.onload = function(e) {
    var typedArray = new Uint8Array(e.target.result);

    pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
    var numPages = pdf.numPages;
    var extractedText = "";

    var getPageText = function(pageIndex) {
        return pdf.getPage(pageIndex).then(function(page) {
            return page.getTextContent().then(function(textContent) {
                var pageText = "";
                textContent.items.forEach(function(item) {
                  pageText += item.str + " ";
                });
                return pageText;
              });
            });
          };

          var pagePromises = [];
          for (var i = 1; i <= numPages; i++) {
            pagePromises.push(getPageText(i));
          }

          Promise.all(pagePromises).then(function(pages) {
            extractedText = pages.join("\n");

            var outputDiv = document.getElementById('output');
            if (outputDiv) {
              outputDiv.innerText = extractedText;

              var downloadLink = document.getElementById('downloadLink');
              downloadLink.href = URL.createObjectURL(new Blob([extractedText], { type: 'text/plain' }));
              downloadLink.download = 'converted_text.txt';
              downloadLink.style.display = 'inline-block';
              var preview=document.getElementById('preview');
              var cont=document.getElementById('cont');
              var output=document.getElementById('output');
              cont.style.display='inline-block';
            //   preview.style.display='inline-block';
              
            //   output.style.display='inline-block';
            }
          }).catch(function(error) {
            console.log(error);
          });
        });
      };
      reader.readAsArrayBuffer(file);
    }