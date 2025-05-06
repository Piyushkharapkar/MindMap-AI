
document.getElementById('generate').addEventListener('click', generateMindMap);

// Track the currently selected node for editing
let currentEditNode = null;

async function generateMindMap() {
    const topic = document.getElementById('topic').value.trim();
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerHTML = ""; // Clear previous error messages

    if (!topic) {
        showErrorMessage("Please enter a topic!");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/generate/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ topic })
        });

        if (response.ok) {
            const mindmapData = await response.json();
            renderMindMap(mindmapData);
        } else {
            const data = await response.json();
            showErrorMessage(data.error || "An error occurred!");
        }
    } catch (error) {
        showErrorMessage("Failed to connect to the backend.");
        console.error(error);
    }
}

// Enhanced error message display function
function showErrorMessage(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.innerHTML = message;

    // Automatically clear after 5 seconds
    setTimeout(() => {
        errorElement.innerHTML = "";
    }, 5000);
}

function renderMindMap(data) {
    const nodes = [];
    const edges = [];

    // Add root node with special styling
    nodes.push({
        data: { id: data.topic, label: data.topic },
        classes: 'cy-root-node'
    });

    data.branches.forEach((branch, index) => {
        const branchId = `branch_${index}`;
        // Add branch node with special styling
        nodes.push({
            data: { id: branchId, label: branch.title },
            classes: 'cy-branch-node'
        });

        branch.subtopics.forEach((subtopic, subIndex) => {
            const subtopicId = `sub_${index}_${subIndex}`;
            // Add subtopic node with special styling
            nodes.push({
                data: { id: subtopicId, label: subtopic },
                classes: 'cy-subtopic-node'
            });
            edges.push({ data: { source: branchId, target: subtopicId } });
        });

        edges.push({ data: { source: data.topic, target: branchId } });
    });

    // Add spinner while loading
    const cyElement = document.getElementById('cy');
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.display = 'block';
    cyElement.innerHTML = '';
    cyElement.appendChild(spinner);

    // Initialize Cytoscape.js
    setTimeout(() => {
        spinner.style.display = 'none';

        const cy = cytoscape({
            container: cyElement,
            elements: [...nodes, ...edges],
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#3b82f6',
                        'label': 'data(label)',
                        'color': '#fff',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'width': 'label',
                        'height': 'label',
                        'padding': '10px',
                        'text-outline-width': '2px',
                        'text-outline-color': 'rgba(15, 23, 42, 0.8)',
                        'font-weight': 'bold'
                    }
                },
                {
                    selector: 'node.cy-root-node',
                    style: {
                        'background-color': '#ec4899',
                        'border-width': '2px',
                        'border-color': 'rgba(255, 255, 255, 0.6)',
                        'font-size': '16px',
                        'padding': '12px'
                    }
                },
                {
                    selector: 'node.cy-branch-node',
                    style: {
                        'background-color': '#3b82f6',
                        'border-width': '2px',
                        'border-color': 'rgba(255, 255, 255, 0.4)',
                        'font-size': '14px',
                        'padding': '10px'
                    }
                },
                {
                    selector: 'node.cy-subtopic-node',
                    style: {
                        'background-color': 'rgba(203, 213, 225, 0.2)',
                        'border-width': '1px',
                        'border-color': 'rgba(255, 255, 255, 0.3)',
                        'font-size': '12px',
                        'padding': '8px',
                        'text-outline-width': '1px'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': 'rgba(203, 213, 225, 0.6)',
                        'target-arrow-color': 'rgba(203, 213, 225, 0.6)',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'arrow-scale': 0.8
                    }
                }
            ],
            layout: {
                name: 'cose',  // Cose layout for a more natural flow
                fit: true,  // Automatically fits the mind map to the viewport
                padding: 180,  // More padding to prevent nodes from being too close to edges
                nodeRepulsion: 40000,  // Increased repulsion to prevent nodes from crowding each other
                idealEdgeLength: 200,  // Increase edge length for wider spacing between nodes
                nodeOverlap: 40,  // Prevent nodes from overlapping even more
                gravity: 20,  // Slightly reduced gravity to give more space and balance nodes
                edgeElasticity: 160,  // Increased elasticity to prevent edges from causing collisions
                nestingFactor: 3,  // Limit nesting depth for better organization
                numIter: 2000,  // Increased iterations for better distribution
                animate: true,  // Smooth transitions during animation
                animationDuration: 1000,  // Duration for the animation to be smooth
                randomize: false,  // No randomization for consistent layout
            }
        });

        // Enable node dragging
        cy.nodes().grabify();

        // Hover interactions
        cy.on('mouseover', 'node', function (e) {
            e.target.style('background-color', '#8b5cf6');
            e.target.style('box-shadow', '0 0 15px rgba(139, 92, 246, 0.7)');
            e.target.connectedEdges().style('line-color', 'rgba(139, 92, 246, 0.8)');
            e.target.connectedEdges().style('target-arrow-color', 'rgba(139, 92, 246, 0.8)');
            e.target.connectedEdges().style('width', '3px');
        });

        cy.on('mouseout', 'node', function (e) {
            if (e.target.hasClass('cy-root-node')) {
                e.target.style('background-color', '#ec4899');
            } else if (e.target.hasClass('cy-branch-node')) {
                e.target.style('background-color', '#3b82f6');
            } else {
                e.target.style('background-color', 'rgba(203, 213, 225, 0.2)');
            }
            e.target.style('box-shadow', 'none');
            e.target.connectedEdges().style('line-color', 'rgba(203, 213, 225, 0.6)');
            e.target.connectedEdges().style('target-arrow-color', 'rgba(203, 213, 225, 0.6)');
            e.target.connectedEdges().style('width', '2px');
        });

        // Double click for edit (prevents conflict with pulse animation)
        cy.on('dbltap', 'node', function (e) {
            const node = e.target;
            openEditor(node);
        });

        // Click effect
        cy.on('tap', 'node', function (e) {
            const node = e.target;
            pulseAnimation(node);
        });

        // Track node position changes (for potential save to backend)
        cy.on('dragfree', 'node', function (e) {
            const node = e.target;
            const pos = node.position();
            console.log('Node position updated:', node.id(), pos);
            // Here you could send position data to backend via API/WebSocket
        });

        // Set up download buttons
        setupDownloadButtons(cy);
    }, 800); // Short delay to show loading spinner
}

// Pulse animation effect
function pulseAnimation(node) {
    const originalPadding = node.style('padding');
    const originalColor = node.style('background-color');

    node.animate({
        style: {
            'background-color': '#8b5cf6',
            'padding': parseInt(originalPadding) + 5
        },
        duration: 300
    }).animate({
        style: {
            'background-color': originalColor,
            'padding': originalPadding
        },
        duration: 300
    });
}

// Node editor functions
function openEditor(node) {
    currentEditNode = node;
    const editorModal = document.getElementById('editor-modal');
    const nodeContent = document.getElementById('node-content');

    nodeContent.value = node.data('label');
    editorModal.classList.remove('hidden');
}

function closeEditor() {
    const editorModal = document.getElementById('editor-modal');
    editorModal.classList.add('hidden');
    currentEditNode = null;
}

// Set up the download buttons functionality
function setupDownloadButtons(cy) {
    // Download as PNG
    document.getElementById('download-png').addEventListener('click', () => {
        const png = cy.png({
            output: 'blob',
            bg: 'white',
            full: true,
            scale: 2
        });

        const url = URL.createObjectURL(png);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mindmap.png';
        link.click();

        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
    });

    // Download as PDF
    document.getElementById('download-pdf').addEventListener('click', () => {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('landscape');

            const png = cy.png({
                output: 'base64',
                bg: 'white',
                full: true,
                scale: 1.5
            });

            const imgProps = pdf.getImageProperties('data:image/png;base64,' + png);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(png, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
            pdf.save('mindmap.pdf');
        } catch (error) {
            console.error('PDF generation error:', error);
            showErrorMessage('Failed to generate PDF. Please try again.');
        }
    });
}

// Initialize event listeners for editor
document.getElementById('save-content').addEventListener('click', function () {
    if (currentEditNode) {
        const newContent = document.getElementById('node-content').value;
        currentEditNode.data('label', newContent);

        // Here you could send updated content to backend via API/WebSocket
        console.log('Node content updated:', currentEditNode.id(), newContent);

        closeEditor();
    }
});

document.getElementById('cancel-edit').addEventListener('click', closeEditor);

// Loading state for generate button
document.getElementById('generate').addEventListener('click', function () {
    this.classList.add('loading');
    setTimeout(() => {
        this.classList.remove('loading');
    }, 2000); // Remove after API response or timeout
});

