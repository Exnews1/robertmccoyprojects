#!/usr/bin/env python3
"""
Simple HTTP server for the U.S. Incarceration Research Hub
Serves static files for the website
"""

import http.server
import socketserver
import os

# Configuration
PORT = 8000
DIRECTORY = "."

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    """Start the HTTP server"""
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 U.S. Incarceration Research Hub Server")
        print(f"📡 Server running at http://localhost:{PORT}")
        print(f"📂 Serving directory: {os.path.abspath(DIRECTORY)}")
        print(f"🌐 Press Ctrl+C to stop the server")
        print("-" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n⏹️  Server stopped")
            print("Thank you for using U.S. Incarceration Research Hub!")

if __name__ == "__main__":
    run_server()
