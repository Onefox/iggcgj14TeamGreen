define([
], function() {
	var Path = function Path(start, destination, board) {
		// list of open nodes (nodes to be inspected)
		var open = [],
			// list of closed nodes (nodes already inspected)
			closed = [],
			// cost from start to current node
			g = 0,
			// cost from current node to destination
			h = this.heuristic(start, destination),
			// cost from start to destination going through the current node
			f = g + h,
			currentNode,
			path,
			bestNode,
			bestCost,
			i;

		// create start and destination as true nodes
		start = node(start.x, start.y, -1, -1, -1, -1);
		destination = node(destination.x, destination.y, -1, -1, -1, -1);

		// push the start node onto the list of open nodes
		open.push(start);

		// keep going while there are nodes in the open list
		while (open.length > 0) {
			// open list sorted lowest to highest (lowest f-value at index 0)
			bestCost = open[0].f;
			bestNode = 0;

			// look whether there is a better cost in the open list
			for (i = 1; i < open.length; i++) {
				if (open[i].f < bestCost) {
					bestCost = open[i].f;
					bestNode = i;
				}
			}

			// set it as our current node
			currentNode = open[bestNode];

			// check if we've destination reached
			if (currentNode.x == destination.x && currentNode.y == destination.y) {
				// initialize the path with the destination node
				path = [destination];

				// go up the chain to recreate the path
				while (currentNode.parentIndex != -1) {
					currentNode = closed[currentNode.parentIndex];
					path.unshift(currentNode);
				}

				return path;
			}

			// remove the current node from our open list
			open.splice(bestNode, 1);

			// push it onto the closed list
			closed.push(currentNode);

			// expand our current node (look in all 8 directions)
			var oldPos = {x: currentNode.x, y: currentNode.y};

			var newPos = new Array(9);
			
			newPos[0] = utilGetNewPos("north", oldPos);

			newPos[1] = utilGetNewPos("northEast", oldPos);

			newPos[2] = utilGetNewPos("east", oldPos);
		
			newPos[3] = utilGetNewPos("southEast", oldPos);
			
			newPos[4] = utilGetNewPos("south", oldPos);

			newPos[5] = utilGetNewPos("southWest", oldPos);

			newPos[6] = utilGetNewPos("west", oldPos);

			newPos[7] = utilGetNewPos("northWest", oldPos);
			
			newPos[8] = oldPos;
			
			for (var i = 0; i < newPos.length; i++)
			{
				//if the node exists 
				if (typeof(board[newPos[i].x]) != "undefined" && typeof(board[newPos[i].y]) != "undefined")
				{
					//if the new node is open or the new node is our destination
					if (board[newPos[i].x][newPos[i].y] == true || (destination.x == newPos[i].x && destination.y == newPos[i].y)) 
					{
						//see if the node is already in our closed list. if so, skip it.
						var foundInClosed = false;
						
						//found in closed
						for (var j in closed)
						{
							if (closed[j].x == newPos[i].x && closed[j].y == newPos[i].y)
							{
								foundInClosed = true;
								break;
							}
						}

						//continue
						if (foundInClosed)
							continue;

						//see if the node is in our open list. If not, use it
						var foundInOpen = false;
						
						for (var j in open)
						{
							if (open[j].x == newPos[i].x && open[j].y == newPos[i].y)
							{
								foundInOpen = true;
								break;
							}
						}

						//not found in open
						if (!foundInOpen)
						{
							var newNode = node(newPos[i].x, newPos[i].y, closed.length-1, -1, -1, -1);

							newNode.g = currentNode.g + cost(currentNode, newNode);
							newNode.h = heuristic(newNode, destination);
							newNode.f = newNode.g + newNode.h;

							open.push(newNode);
						}
					}
				}
			}
		}

		return [];
	}

	// calc cost
	Path.prototype.cost = function cost(currentNode, newNode) {
		var score = null,
			direction = utilGetAdjacentDirection(currentNode, newNode);
		
		//set score based on direction
		if (direction  == "north" || direction  == "east" || direction  == "south" || direction  == "west")
		{
			score = 14;
		}
		else
		{
			score = 10;
		}
		
		return score;
	}

				//calc heuristic
		function heuristic(currentNode, destination)
		{	
			return Math.floor(Math.sqrt(Math.pow(currentNode.x-destination.x, 2)+Math.pow(currentNode.y-destination.y, 2)));
		}

		//create node
		function node(x, y, parentIndex, g, h, f)
		{
			var object = {
				x: x,
				y: y,
				parentIndex: parentIndex,
				g: g,
				h: h,
				f: f
			};
			
			return object;
		}
});