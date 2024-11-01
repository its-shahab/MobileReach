// Function to add a CSS-like radial gradient as a background rectangle in frames

async function addGradientBackgroundToFrames(frameNodes: readonly SceneNode[], opacity: number, hand: string, position: string) {
  console.log("in gradient",opacity,hand,position);
  const GTNormalR = [
    [-0.37848758697509766, -0.5260326862335205, 1.108984351158142], // Horizontal scale (59.7%) and horizontal position (78.61%)
    [0.299323171377182, -1.018005132675171, 0.8674774169921875] // Vertical scale (97.75%) and vertical position (59.21%)
  ];
  const GTNormalL = [
    [0.29802781343460083, -0.5915388464927673, 0.8098481297492981],
    [0.33655789494514465, 0.8015139102935791, -0.03954540193080902]
  ];
  const GTPinkyR = [
    [-0.39409691095352173, -0.1048644632101059, 0.936943769454956],
    [0.038383711129426956, -0.6818556189537048, 1.0960630178451538]
  ];
  const GTPinkyL = [
    [0.38578978180885315, -0.045207250863313675, 0.48774123191833496],
    [0.01654728874564171, 0.667482852935791, -0.11480078101158142]
  ];
  
  

  for (const frameNode of frameNodes) {
    // if (frameNode.type === "FRAME" && frameNode.layoutMode != "NONE"){
    //   frameNode.layoutMode = "NONE";
    //   console.log(frameNode.layoutMode);
    //   const scaleFactorWidth = 617.78 / frameNode.width;
    //   const scaleFactorHeight = 1339.48 / frameNode.height;
    //   const scaleFactor = (scaleFactorWidth + scaleFactorHeight) / 2;
    //   frameNode.rescale(scaleFactor);
    //   frameNode.resize(617.78, 1339.48)
    // }
    //setting gradient stops and transforms according to position and hand

    let GT: Transform  | undefined;
    let GS: number;
    if(position=="normal"){
      GS = 0.65;
      if(hand=="right"){
        GT = GTNormalR as Transform;
      } else if(hand=="left"){
        GT = GTNormalL as Transform;
      }
    } else {
      GS = 0.75;
      if(hand=="right"){
        GT = GTPinkyR as Transform;
      } else if(hand=="left"){
        GT = GTPinkyL as Transform;
      }
    };
    if (frameNode.type === "FRAME" && GT != undefined) {
      try {
        // Create a rectangle that matches the frame's dimensions
        const backgroundRect = figma.createRectangle();
        backgroundRect.resize(frameNode.width, frameNode.height);

        // Apply radial gradient to match the CSS-like structure
        backgroundRect.fills = [{
          type: "GRADIENT_RADIAL",
          // Adjust gradientTransform to approximate the CSS gradient's size and position
          gradientTransform: GT,
          gradientStops: [
            { position: 0, color: { r: 25 / 255, g: 103 / 255, b: 25 / 255, a: 1 * (opacity / 100) } },
            { position: GS, color: { r: 159 / 255, g: 204 / 255, b: 36 / 255, a: 1 * (opacity / 100) } },
            { position: 1, color: { r: 122 / 255, g: 32 / 255, b: 32 / 255, a: 1 * (opacity / 100) } },
          ],
          opacity: opacity / 100,
        }];

        // Insert the rectangle at the back of the frame's child elements
        frameNode.appendChild(backgroundRect);
        //frameNode.insertChild(0, backgroundRect); // Insert as the first child to ensure it's at the back

        figma.notify(`Gradient background added to frame: "${frameNode.name}" with opacity: ${opacity}%`);
        console.log(`Gradient background applied to frame "${frameNode.name}" with opacity:`, opacity);

      } catch (error) {
        console.error("Error creating gradient background for frame:", frameNode.name, error);
        figma.notify(`Failed to create gradient background for "${frameNode.name}": `);
      }
    } else {
      figma.notify(`Selected node "${frameNode.name}" is not a frame.`);
    }
  }
}

// Listen for messages from the UI
figma.ui.onmessage = (msg) => {
  if (msg.type === 'set-opacity') {
    const selectedNodes = figma.currentPage.selection; // Get all selected nodes
    if (selectedNodes.length > 0) {
      addGradientBackgroundToFrames(selectedNodes, msg.opacity, msg.hand, msg.pos).catch(error => {
        console.error("Unexpected error:", error);
        figma.notify("Unexpected error. Check console for details.");
      });
    } else {
      figma.notify("No frames selected.");
    }
  } else {
    figma.notify("Enter All Inputs.")
  }
};

// Show the UI
figma.showUI(__html__,{ width: 400, height: 650, title: "ThumbSpan" });
