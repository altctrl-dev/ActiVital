#!/usr/bin/env python3
"""
Automated statistics generation scheduler for ActiVital Dashboard.

This script can be run manually or scheduled via cron to automatically
process new log files and update statistics.
"""

import sys
import os
import time
from datetime import datetime, timedelta

# Add parent directory to path to import from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import subprocess
from logger import app_logger as logger

def run_full_update():
    """Run a complete update of logs and statistics."""
    try:
        logger.info("Starting automated statistics update...")
        start_time = time.time()

        # Step 1: Parse any new log files
        logger.info("Step 1: Parsing log files...")
        result = subprocess.run([sys.executable, 'parser/parse_logs.py'],
                              capture_output=True, text=True)

        if result.returncode != 0:
            logger.error(f"Log parsing failed: {result.stderr}")
            return False

        logger.info("Log parsing completed successfully")

        # Step 2: Update all statistics
        logger.info("Step 2: Computing statistics...")
        result = subprocess.run([sys.executable, 'parser/transform.py'],
                              capture_output=True, text=True)

        if result.returncode != 0:
            logger.error(f"Statistics computation failed: {result.stderr}")
            return False

        logger.info("Statistics computation completed successfully")

        elapsed_time = time.time() - start_time
        logger.info(f"Full update completed successfully in {elapsed_time:.2f} seconds")

        return True

    except Exception as e:
        logger.error(f"Error during automated update: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return False

def run_stats_only():
    """Run only statistics computation (skip log parsing)."""
    try:
        logger.info("Starting statistics-only update...")
        start_time = time.time()

        result = subprocess.run([sys.executable, 'parser/transform.py'],
                              capture_output=True, text=True)

        if result.returncode != 0:
            logger.error(f"Statistics computation failed: {result.stderr}")
            return False

        logger.info("Statistics computation completed successfully")

        elapsed_time = time.time() - start_time
        logger.info(f"Statistics update completed in {elapsed_time:.2f} seconds")

        return True

    except Exception as e:
        logger.error(f"Error during statistics update: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        return False

def main():
    """Main scheduler function."""
    import argparse

    parser = argparse.ArgumentParser(description='ActiVital Statistics Scheduler')
    parser.add_argument('--mode', choices=['full', 'stats-only'], default='full',
                       help='Update mode: full (parse logs + stats) or stats-only')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Enable verbose logging')

    args = parser.parse_args()

    if args.verbose:
        logger.setLevel('DEBUG')

    print(f"ActiVital Statistics Scheduler - {datetime.now()}")
    print(f"Mode: {args.mode}")
    print("-" * 50)

    if args.mode == 'full':
        success = run_full_update()
    else:
        success = run_stats_only()

    if success:
        print("✅ Update completed successfully!")
        sys.exit(0)
    else:
        print("❌ Update failed! Check logs for details.")
        sys.exit(1)

if __name__ == '__main__':
    main()